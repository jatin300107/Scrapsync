from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Box(BaseModel):
    x: float
    y: float
    w: float
    h: float


class IdentifiedItem(BaseModel):
    name: str
    category: str
    box: Box


class IdentifyOut(BaseModel):
    items: List[IdentifiedItem]


class CategoryEntry(BaseModel):
    category: str
    weight_kg: float = Field(gt=0)
    items: List[str] = Field(default_factory=list)


class SafetyRule(BaseModel):
    category: str
    hazard_type: str
    rule_text: str
    source_reference: str


class RecyclerSummary(BaseModel):
    id: int
    name: str
    facility_location: str
    is_authorized: bool
    authorization_details: Optional[str] = None
    contact_info: str


class OfferOut(BaseModel):
    recycler: RecyclerSummary
    rate_card_total: Optional[int] = None
    quoted_price: Optional[int] = None
    offered_at: Optional[datetime] = None
    quoted_at: Optional[datetime] = None


class LotOut(BaseModel):
    uuid: str
    status: str
    image_url: str
    categories: List[CategoryEntry]
    total_weight_kg: float
    estimated_min: Optional[int] = None
    estimated_max: Optional[int] = None
    safety_guidelines: List[SafetyRule]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    offer: Optional[OfferOut] = None
    audit_uuid: Optional[str] = None
    created_at: datetime