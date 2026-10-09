
from sqlmodel import Session, select
from app.backend.models import Lot
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

def recycler_summary(rc) -> dict:
    return {
        "id": rc.id,
        "name": rc.name,
        "facility_location": rc.facility_location,
        "is_authorized": rc.is_authorized,
        "authorization_details": rc.authorization_details,
        "contact_info": rc.contact_info,
    }
def iso(dt: Optional[datetime]) -> Optional[str]:
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ") if dt else None

def get_lot_or_404(session: Session, lot_uuid: str):
    lot = session.exec(select(Lot).where(Lot.uuid == lot_uuid)).first()
    if not lot:
        raise HTTPException(404, "Lot not found")
    return lot