import json
import logging
import os

from sqlmodel import Session, select
from app.backend.models import Lot
from fastapi import HTTPException
from typing import Optional
from datetime import datetime 
import urllib.parse
import urllib.request
from typing import Optional, Tuple

logger = logging.getLogger(__name__)



def get_coordinates_from_address(address: str) -> Tuple[Optional[float], Optional[float]]:
    """Address -> (lat, lon) via ORS geocoding. Returns (None, None) on any failure."""
    key = os.environ.get("ORS_API_KEY")
    if not key or not address or not address.strip():
        return None, None

    params = urllib.parse.urlencode({
        "api_key": key,
        "text": address.strip(),
        "boundary.country": "IN",  # keeps "Sector 62" from matching somewhere abroad
        "size": 1,
    })
    try:
        with urllib.request.urlopen(
            f"https://api.openrouteservice.org/geocode/search?{params}", timeout=5
        ) as resp:
            features = json.loads(resp.read().decode("utf-8")).get("features", [])
        if not features:
            return None, None
        lon, lat = features[0]["geometry"]["coordinates"]  # GeoJSON order is [lon, lat]
        return lat, lon
    except Exception as e:
        logger.warning("Geocoding failed: %s", type(e).__name__)  # do not log the address
        return None, None
    
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