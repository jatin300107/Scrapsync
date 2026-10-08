from datetime import datetime
from typing import List, Optional

from sqlmodel import JSON, Column, Field, Relationship, SQLModel


class Collector(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone_number: str
    preferred_language: str = "en"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Recycler(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    facility_location: str
    latitude: float
    longitude: float
    is_authorized: bool = True
    authorization_details: Optional[str] = None
    contact_info: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    rates: List["RecyclerRate"] = Relationship(back_populates="recycler")


class RecyclerRate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recycler_id: int = Field(foreign_key="recycler.id", index=True)
    material_category: str = Field(index=True)
    rate_per_kg: int

    recycler: Recycler = Relationship(back_populates="rates")


class Lot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    collector_id: int = Field(foreign_key="collector.id", index=True)
    image_ref: str  # S3 key
    # [{"name": "...", "category": "...", "est_weight_kg": 0.0}, ...]
    items: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    weight_kg: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    safety_guidance_text: Optional[str] = None
    status: str = "created"  # created | matched | accepted
    chosen_recycler_id: Optional[int] = Field(default=None, foreign_key="recycler.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Audit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lot_id: int = Field(foreign_key="lot.id", unique=True, index=True)
    collector_id: int = Field(foreign_key="collector.id")
    recycler_id: int = Field(foreign_key="recycler.id")

    # snapshot at the moment the collector accepts a recycler
    items: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    weight_kg: float
    estimated_price: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # filled during handover
    agreed_price: Optional[int] = None
    collector_confirmed_at: Optional[datetime] = None
    recycler_confirmed_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)