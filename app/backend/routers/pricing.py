from collections import defaultdict
from typing import Dict, List

from sqlmodel import Session, select

from app.backend.models import RecyclerRate


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