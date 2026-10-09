from app.backend.models import RecyclerRate , Lot, Collector, Recycler
from sqlmodel import Session, select
from typing import Dict, List, Optional
import math 
from app.backend.workers.helpers import recycler_summary ,iso
from datetime import datetime

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

