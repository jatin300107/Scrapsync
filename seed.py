from sqlmodel import Session

from app.backend.constants import CATEGORY_KEYS
from app.backend.db import engine
from app.backend.models import Collector, Recycler, RecyclerRate

# Illustrative rates in INR per kg, not real market data
BASE_RATES = {
    "mobile_phone": 350,
    "laptop": 220,
    "battery": 90,
    "cable_wire": 120,
    "circuit_board": 400,
    "small_appliance": 25,
    "large_appliance": 18,
    "other": 10,
}

# (name, location, lat, lon, rate multiplier, categories NOT accepted)
RECYCLERS = [
    ("GreenLoop E-Recyclers", "Mayapuri, New Delhi", 28.6360, 77.1270, 1.00, []),
    ("EcoCircuit Solutions", "Okhla Phase 2, New Delhi", 28.5355, 77.2700, 1.15, ["large_appliance"]),
    ("Metro Material Recovery", "Sector 63, Noida", 28.6270, 77.3780, 0.90, []),
    ("CleanCycle Industries", "Bhiwadi Industrial Area, Rajasthan", 28.2100, 76.8600, 1.25, ["battery", "other"]),
    ("Urban Reclaim Pvt Ltd", "Sahibabad, Ghaziabad", 28.6800, 77.3600, 1.05, ["circuit_board"]),
]


def seed():
    with Session(engine) as session:
        session.add(
            Collector(name="Demo Collector", phone_number="9999999999", preferred_language="en")
        )

        for name, loc, lat, lon, mult, excluded in RECYCLERS:
            recycler = Recycler(
                name=name,
                facility_location=loc,
                latitude=lat,
                longitude=lon,
                is_authorized=True,
                authorization_details="CPCB authorized (demo data)",
                contact_info="contact@example.com",
            )
            session.add(recycler)
            session.flush()  # populates recycler.id

            for key in CATEGORY_KEYS:
                if key in excluded:
                    continue
                session.add(
                    RecyclerRate(
                        recycler_id=recycler.id,
                        material_category=key,
                        rate_per_kg=round(BASE_RATES[key] * mult),
                    )
                )

        session.commit()
    print("seeded")


if __name__ == "__main__":
    seed()