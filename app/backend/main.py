import json
from collections import defaultdict
from typing import List, Optional
from app.backend.workers.recyclers import build_offer, audit_to_out 
from app.backend.workers.ors import distances_for
from app.backend.workers.helpers import get_coordinates_from_address, iso, recycler_summary , get_lot_or_404 
from app.backend.workers.pricing import eligible_recyclers, all_rates, price_recyclers
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile , Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import Session, select
from uuid import uuid4
from app.backend.constants import CATEGORIES, PAGE_SIZE

from app.backend.constants import CATEGORIES
from app.backend.db import get_session
from app.backend.workers.identify_service import IdentificationError, identify_image
from app.backend.models import Audit, Lot, Recycler, SafetyGuideline , utcnow
from .workers.pricing import price_recyclers , price_card
from .workers.schemas import (
    Box,
    CategoryEntry,
    IdentifiedItem,
    IdentifyOut,
    LotOut,
    OfferOut,
    RecyclerSummary,
    SafetyRule,
    OfferIn,
    QuoteIn,
)
from .workers.storage import image_url, upload_image
import logging
logger = logging.getLogger(__name__)
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
    except IdentificationError as e:
        logger.error("Identification failed: %s", e)
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
   
    address: Optional[str] = Form(None),
    session: Session = Depends(get_session),
):
    data = read_image(image)
    entries = parse_categories(categories)
    keys = [e["category"] for e in entries]

    try:
        image_ref = upload_image(data)
    except Exception:
        raise HTTPException(502, "Image storage failed")
    lat, lon = get_coordinates_from_address(address) if address else (None, None)
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
        latitude=lat,
        longitude=lon,
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


@app.get("/lots")
def list_lots(session: Session = Depends(get_session)):
    lots = session.exec(
        select(Lot).where(Lot.collector_id == DEMO_COLLECTOR_ID).order_by(Lot.created_at.desc())
    ).all()
    return {"lots": [lot_out(session,l) for l in lots]}



@app.get("/lots/{lot_uuid}/recyclers")
def lot_recyclers(lot_uuid: str, page: int = Query(1, ge=1), session: Session = Depends(get_session)):
    lot = get_lot_or_404(session, lot_uuid)
    if lot.status != "created":
        raise HTTPException(409, f"Lot is {lot.status}, recyclers can only be listed when created")

    rows = eligible_recyclers(session, lot.categories)
    total = len(rows)
    start = (page - 1) * PAGE_SIZE
    chunk = rows[start:start + PAGE_SIZE]
    dists = distances_for(lot.latitude, lot.longitude, [r[0] for r in chunk])  # only this page

    return {
        "page": page,
        "page_size": PAGE_SIZE,
        "total": total,
        "has_more": start + PAGE_SIZE < total,
        "recyclers": [
            {
                "recycler": recycler_summary(rc),
                "rate_card_total": rct,
                "breakdown": breakdown,
                "distance_km": km,
                "distance_is_approximate": approx,
            }
            for (rc, rct, breakdown), (km, approx) in zip(chunk, dists)
        ],
    }


@app.post("/lots/{lot_uuid}/offer")
def offer(lot_uuid: str, body: OfferIn, session: Session = Depends(get_session)):
    lot = get_lot_or_404(session, lot_uuid)
    rc = session.get(Recycler, body.recycler_id)
    if not rc:
        raise HTTPException(404, "Recycler not found")
    if lot.status != "created":
        raise HTTPException(409, f"Lot is {lot.status}, cannot offer")
    priced = price_recyclers(session, lot.categories).get(rc.id)  # recomputed from current rates
    if not priced:
        raise HTTPException(422, "Recycler is not eligible for this lot")

    lot.chosen_recycler_id = rc.id
    lot.rate_card_total = priced["total"]
    lot.offered_at = utcnow()
    lot.status = "offered"
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return lot_out(session, lot)


@app.post("/lots/{lot_uuid}/withdraw")
def withdraw(lot_uuid: str, session: Session = Depends(get_session)):
    lot = get_lot_or_404(session, lot_uuid)
    if lot.status not in ("offered", "quoted"):
        raise HTTPException(409, f"Lot is {lot.status}, nothing to withdraw")
    lot.chosen_recycler_id = None
    lot.rate_card_total = None
    lot.quoted_price = None
    lot.offered_at = None
    lot.quoted_at = None
    lot.status = "created"
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return lot_out(session, lot)


@app.post("/lots/{lot_uuid}/agree", status_code=201)
def agree(lot_uuid: str, session: Session = Depends(get_session)):
    lot = get_lot_or_404(session, lot_uuid)
    if lot.status != "quoted":
        raise HTTPException(409, f"Lot is {lot.status}, cannot agree")

    now = utcnow()
    audit = Audit(
        uuid=str(uuid4()),
        lot_id=lot.id,
        collector_id=lot.collector_id,
        recycler_id=lot.chosen_recycler_id,
        categories=lot.categories,          # snapshot
        rate_card_total=lot.rate_card_total,
        agreed_price=lot.quoted_price,
        latitude=lot.latitude,
        longitude=lot.longitude,
        recycler_confirmed_at=lot.quoted_at,
        collector_confirmed_at=now,
        created_at=now,
    )
    lot.status = "closed"
    session.add(audit)
    session.add(lot)
    session.commit()
    session.refresh(audit)
    return audit_to_out(audit, session)


@app.get("/audits/{audit_uuid}")
def get_audit(audit_uuid: str, session: Session = Depends(get_session)):
    audit = session.exec(select(Audit).where(Audit.uuid == audit_uuid)).first()
    if not audit:
        raise HTTPException(404, "Audit not found")
    return audit_to_out(audit, session)


# ---------- recycler endpoints ----------

@app.get("/recyclers")
def list_recyclers(session: Session = Depends(get_session)):
    rows = session.exec(select(Recycler).order_by(Recycler.id)).all()
    return [{"id": r.id, "name": r.name, "facility_location": r.facility_location} for r in rows]


@app.get("/recyclers/{recycler_id}/offers")
def recycler_offers(recycler_id: int, session: Session = Depends(get_session)):
    if not session.get(Recycler, recycler_id):
        raise HTTPException(404, "Recycler not found")
    lots = session.exec(
        select(Lot)
        .where(Lot.chosen_recycler_id == recycler_id)
        .where(Lot.status.in_(["offered", "quoted", "closed"]))
        .order_by(Lot.offered_at.desc())
    ).all()
    return {"lots": [lot_out(session, l) for l in lots]}


@app.post("/lots/{lot_uuid}/quote")
def quote(lot_uuid: str, body: QuoteIn, session: Session = Depends(get_session)):
    lot = get_lot_or_404(session, lot_uuid)
    if lot.status != "offered":
        raise HTTPException(409, f"Lot is {lot.status}, cannot quote")
    if body.recycler_id != lot.chosen_recycler_id:
        raise HTTPException(403, "This lot was not offered to this recycler")
    lot.quoted_price = body.price
    lot.quoted_at = utcnow()
    lot.status = "quoted"
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return lot_out(session, lot)