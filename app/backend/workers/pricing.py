from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Session, select
from app.backend.workers.helpers import recycler_summary , iso
from app.backend.models import RecyclerRate , Lot, Collector, Recycler
import math


def money(x: float) -> int:
    # one rounding rule everywhere (half up), so list, offer and audit always agree
    return int(math.floor(x + 0.5))

def price_recyclers(session: Session, categories: List[dict]) -> Dict[int, dict]:
    """Return {recycler_id: {"total": int, "breakdown": [...]}} for every recycler
    that has a rate for EVERY category in the lot."""
    keys = [c["category"] for c in categories]
    rows = session.exec(
        select(RecyclerRate).where(RecyclerRate.material_category.in_(keys))
    ).all()

    rates = defaultdict(dict)  # recycler_id -> {category: rate_per_kg}
    for r in rows:
        rates[r.recycler_id][r.material_category] = r.rate_per_kg

    result = {}
    for recycler_id, by_cat in rates.items():
        if not all(k in by_cat for k in keys):
            continue
        breakdown = []
        for c in categories:
            rate = by_cat[c["category"]]
            breakdown.append(
                {
                    "category": c["category"],
                    "weight_kg": c["weight_kg"],
                    "rate_per_kg": rate,
                    "price": round(c["weight_kg"] * rate),
                }
            )
        result[recycler_id] = {
            "total": sum(b["price"] for b in breakdown),
            "breakdown": breakdown,
        }
    return result

def eligible_recyclers(session: Session, categories: list) -> list:
    """[(recycler, rate_card_total, breakdown)] best price first, ties by id."""
    priced = price_recyclers(session, categories)
    if not priced:
        return []
    recyclers = session.exec(select(Recycler).where(Recycler.id.in_(list(priced)))).all()
    rows = [(rc, priced[rc.id]["total"], priced[rc.id]["breakdown"]) for rc in recyclers]
    rows.sort(key=lambda r: (-r[1], r[0].id))
    return rows

def all_rates(session: Session) -> dict:
    out: dict = {}
    for r in session.exec(select(RecyclerRate)).all():
        out.setdefault(r.recycler_id, {})[r.material_category] = r.rate_per_kg
    return out


def build_offer(lot, session: Session) -> Optional[dict]:
    """Use this inside lot_out for the `offer` field."""
    if lot.chosen_recycler_id is None:
        return None
    rc = session.get(Recycler, lot.chosen_recycler_id)
    return {
        "recycler": recycler_summary(rc),
        "rate_card_total": lot.rate_card_total,
        "quoted_price": lot.quoted_price,
        "offered_at": iso(lot.offered_at),
        "quoted_at": iso(lot.quoted_at),
    }


def audit_to_out(audit, session: Session) -> dict:
    lot = session.get(Lot, audit.lot_id)
    collector = session.get(Collector, audit.collector_id)
    rc = session.get(Recycler, audit.recycler_id)
    rct = audit.rate_card_total
    deviation = round((audit.agreed_price - rct) / rct * 100, 1) if rct else None
    return {
        "uuid": audit.uuid,
        "lot_uuid": lot.uuid,
        "collector": {"name": collector.name},
        "recycler": recycler_summary(rc),
        "categories": audit.categories,
        "total_weight_kg": round(sum(c["weight_kg"] for c in audit.categories), 3),
        "rate_card_total": rct,
        "agreed_price": audit.agreed_price,
        "deviation_percent": deviation,
        "latitude": audit.latitude,
        "longitude": audit.longitude,
        "recycler_confirmed_at": iso(audit.recycler_confirmed_at),
        "collector_confirmed_at": iso(audit.collector_confirmed_at),
        "created_at": iso(audit.created_at),
    }

def price_card(categories: list, rates: dict):
    """Returns (total, breakdown) or None if the recycler misses any category."""
    breakdown = []
    for c in categories:
        rate = rates.get(c["category"])
        if rate is None:
            return None
        breakdown.append({
            "category": c["category"],
            "weight_kg": c["weight_kg"],
            "rate_per_kg": rate,
            "price": money(c["weight_kg"] * rate),
        })
    return sum(b["price"] for b in breakdown), breakdown