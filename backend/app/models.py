from sqlmodel import SQLModel, Relationship, Field ,  Column , JSON
from typing import Optional, List  , Text
from enum import Enum
from datetime import datetime, time

class LotStatus(str, Enum):
    created = "created"
    priced = "priced"
    matched = "matched"
    handed_over = "handed_over"
    audited = "audited"
    closed = "closed"


class TransactionStatus(str, Enum):
    quoted = "quoted"
    matched = "matched"
    handover = "handover"
    confirmed = "confirmed"
    paid = "paid"


class PaymentStatus(str, Enum):
    cash = "cash"
    digital = "digital"
    pending = "pending"


class Collector(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password_hash: str
    phone_number: str
    preferred_language: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Recycler(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    password_hash: str
    facility_location: str
    latitude: float
    longitude: float
    authorization_status: bool
    authorization_details: Optional[str] = None
    contact_info: str
    pickup_availability: str
    service_area: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    rates: List["RecyclerRate"] = Relationship(back_populates="recycler")


class RecyclerRate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recycler_id: int = Field(foreign_key="recycler.id")
    material_category: str
    offered_rate: int
    unit: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    recycler: Recycler = Relationship(back_populates="rates")


class SafetyGuideline(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    material_category: str
    rule_text: str
    hazard_type: str


class Lot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str
    collector_id: int = Field(foreign_key="collector.id")
    image_ref: str
    category_estimated_prices: dict = Field(default={}, sa_column=Column(JSON))
    classification_confidence: float
    weight: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: LotStatus = Field(default=LotStatus.created)
    safety_guidance_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PriceSeedData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category: str
    sub_category: Optional[str] = None
    source: str
    reference_price: float
    unit: str
    date_recorded: datetime


class PriceEstimate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lot_id: int = Field(foreign_key="lot.id")
    estimated_min: int
    estimated_max: int
    base_price_used: float
   
    location_factor: float|None
    confidence_band: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Match(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lot_id: int = Field(foreign_key="lot.id")
    recycler_id: int = Field(foreign_key="recycler.id")
    
    distance_km: float
    offered_price: int
    matched_at: datetime = Field(default_factory=datetime.utcnow)


class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    lot_id: int = Field(foreign_key="lot.id")
    recycler_id: int = Field(foreign_key="recycler.id")
    status: TransactionStatus = Field(default=TransactionStatus.quoted)
    payment_status: PaymentStatus = Field(default=PaymentStatus.pending)
    final_price: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Audit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str
    transaction_id: int = Field(foreign_key="transaction.id")
    material: List[str] = Field(default=[], sa_column=Column(JSON))
    weight: float
    estimated_price: int
    agreed_price: int
    buyer_id: int = Field(foreign_key="recycler.id")
    seller_id: int = Field(foreign_key="collector.id")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    recycler_confirmation: bool = Field(default=False)
    collector_confirmation: bool = Field(default=False)


class DiscrepancyLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    transaction_id: int = Field(foreign_key="transaction.id")
    estimated_price: int
    actual_price: int
    deviation_percent: float
    flagged: bool = Field(default=False)
    reviewed_status: str = Field(default="pending")