import json
from collections import defaultdict
from typing import List, Optional

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import Session, select

from app.backend.constants import CATEGORIES
from app.backend.db import get_session
from app.backend.routers.identify_service import IdentificationError, identify_image
from app.backend.models import Audit, Lot, Recycler, SafetyGuideline
from .routers.pricing import price_recyclers
from .routers.schemas import (
    Box,
    CategoryEntry,
    IdentifiedItem,
    IdentifyOut,
    LotOut,
    OfferOut,
    RecyclerSummary,
    SafetyRule,
)
from .routers.storage import image_url, upload_image

DEMO_COLLECTOR_ID = 1
MAX_IMAGE_BYTES = 5 * 1024 * 1024

app = FastAPI(title="Kabadiwala Connect")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helpers ----------

def read_image(upload: UploadFile) -> bytes:
    data = upload.file.read()
    if not data:
        raise HTTPException(422, "Empty image upload")
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(422, "Image too large, resize the longest side to 1600 px")
    return data


def box_from_2d(box_2d: List[int]) -> Box:
    ymin, xmin, ymax, xmax = box_2d
    return Box(
        x=round(xmin / 1000, 4),
        y=round(ymin / 1000, 4),
        w=round((xmax - xmin) / 1000, 4),
        h=round((ymax - ymin) / 1000, 4),
    )


def parse_categories(raw: str) -> List[dict]:
    try:
        entries = [CategoryEntry.model_validate(e) for e in json.loads(raw)]
    except (ValueError, TypeError) as e:
        raise HTTPException(422, f"Invalid categories: {e}")
    if not entries:
        raise HTTPException(422, "At least one category is required")
    keys = [e.category for e in entries]
    bad = [k for k in keys if k not in CATEGORIES]
    if bad:
        raise HTTPException(422, f"Unknown categories: {bad}")
    if len(set(keys)) != len(keys):
        raise HTTPException(422, "Each category may appear only once")
    return [e.model_dump() for e in entries]


def lot_out(session: Session, lot: Lot) -> LotOut:
    offer = None
    if lot.chosen_recycler_id:
        recycler = session.get(Recycler, lot.chosen_recycler_id)
        offer = OfferOut(
            recycler=RecyclerSummary.model_validate(recycler, from_attributes=True),
            rate_card_total=lot.rate_card_total,
            quoted_price=lot.quoted_price,
            offered_at=lot.offered_at,
            quoted_at=lot.quoted_at,
        )
    audit = session.exec(select(Audit).where(Audit.lot_id == lot.id)).first()
    return LotOut(
        uuid=lot.uuid,
        status=lot.status,
        image_url=image_url(lot.image_ref),
        categories=[CategoryEntry(**c) for c in lot.categories],
        total_weight_kg=round(sum(c["weight_kg"] for c in lot.categories), 3),
        estimated_min=lot.estimated_min,
        estimated_max=lot.estimated_max,
        safety_guidelines=[SafetyRule(**s) for s in lot.safety_guidelines],
        latitude=lot.latitude,
        longitude=lot.longitude,
        offer=offer,
        audit_uuid=audit.uuid if audit else None,
        created_at=lot.created_at,
    )


# ---------- health ----------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db(session: Session = Depends(get_session)):
    session.execute(text("SELECT 1"))
    return {"db": "ok"}


# ---------- endpoints ----------

@app.get("/categories")
def list_categories():
    return [{"key": k, "label": v} for k, v in CATEGORIES.items()]


@app.post("/identify", response_model=IdentifyOut)
def identify(image: UploadFile = File(...)):
    data = read_image(image)
    try:
        detected = identify_image(data)
    except IdentificationError:
        raise HTTPException(502, "Identification service failed")
    return IdentifyOut(
        items=[
            IdentifiedItem(name=d.name, category=d.category, box=box_from_2d(d.box_2d))
            for d in detected
        ]
    )


@app.post("/lots", response_model=LotOut, status_code=201)
def create_lot(
    image: UploadFile = File(...),
    categories: str = Form(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    session: Session = Depends(get_session),
):
    data = read_image(image)
    entries = parse_categories(categories)
    keys = [e["category"] for e in entries]

    try:
        image_ref = upload_image(data)
    except Exception:
        raise HTTPException(502, "Image storage failed")

    rules = session.exec(
        select(SafetyGuideline)
        .where(SafetyGuideline.material_category.in_(keys))
        .order_by(SafetyGuideline.id)
    ).all()
    by_cat = defaultdict(list)
    for r in rules:
        by_cat[r.material_category].append(r)
    safety = [
        {
            "category": r.material_category,
            "hazard_type": r.hazard_type,
            "rule_text": r.rule_text,
            "source_reference": r.source_reference,
        }
        for k in keys
        for r in by_cat[k]
    ]

    totals = [p["total"] for p in price_recyclers(session, entries).values()]

    lot = Lot(
        collector_id=DEMO_COLLECTOR_ID,
        image_ref=image_ref,
        categories=entries,
        safety_guidelines=safety,
        estimated_min=min(totals) if totals else None,
        estimated_max=max(totals) if totals else None,
        latitude=latitude,
        longitude=longitude,
    )
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return lot_out(session, lot)


@app.get("/lots/{lot_uuid}", response_model=LotOut)
def get_lot(lot_uuid: str, session: Session = Depends(get_session)):
    lot = session.exec(select(Lot).where(Lot.uuid == lot_uuid)).first()
    if not lot:
        raise HTTPException(404, "Lot not found")
    return lot_out(session, lot)