from datetime import datetime, timezone 
from typing import List, Optional
from uuid import uuid4

from sqlmodel import JSON, Column, Field, Relationship, SQLModel


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
class Collector(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone_number: str
    preferred_language: str = "en"
    created_at: datetime = Field(default_factory=utcnow)


class Recycler(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    facility_location: str
    latitude: float
    longitude: float
    is_authorized: bool = True
    authorization_details: Optional[str] = None
    contact_info: str
    created_at: datetime = Field(default_factory=utcnow)

    rates: List["RecyclerRate"] = Relationship(back_populates="recycler")


class RecyclerRate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recycler_id: int = Field(foreign_key="recycler.id", index=True)
    material_category: str = Field(index=True)
    rate_per_kg: int

    recycler: Recycler = Relationship(back_populates="rates")


class SafetyGuideline(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    material_category: str = Field(index=True)
    hazard_type: str
    rule_text: str
    source_reference: str


class Lot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str = Field(default_factory=lambda: str(uuid4()), unique=True, index=True)
    collector_id: int = Field(foreign_key="collector.id", index=True)
    image_ref: str  
    categories: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    safety_guidelines: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    estimated_min: Optional[int] = None
    estimated_max: Optional[int] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    status: str = "created"  # created | offered | quoted | closed
    chosen_recycler_id: Optional[int] = Field(default=None, foreign_key="recycler.id")
    rate_card_total: Optional[int] = None
    quoted_price: Optional[int] = None
    offered_at: Optional[datetime] = None
    quoted_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=utcnow)


class Audit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str = Field(default_factory=lambda: str(uuid4()), unique=True, index=True)
    lot_id: int = Field(foreign_key="lot.id", unique=True, index=True)
    collector_id: int = Field(foreign_key="collector.id")
    recycler_id: int = Field(foreign_key="recycler.id")
    categories: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    rate_card_total: int
    agreed_price: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    recycler_confirmed_at: datetime
    collector_confirmed_at: datetime
    created_at: datetime = Field(default_factory=utcnow)