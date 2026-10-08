# constants.py

CATEGORIES = {
    "mobile_phone": "Mobile phones and smartphones",
    "laptop": "Laptops and notebooks",
    "battery": "Loose batteries, power banks, lithium cells",
    "cable_wire": "Cables, chargers, wires",
    "circuit_board": "Loose PCBs and motherboards",
    "small_appliance": "Mixers, irons, heaters, fans and similar",
    "large_appliance": "Fridges, washing machines, ACs, TVs",
    "other": "Anything that fits none of the above",
}

CATEGORY_KEYS = list(CATEGORIES.keys())


def normalize_category(raw: str) -> str:
    """Force any model output into a valid key."""
    key = (raw or "").strip().lower().replace(" ", "_")
    return key if key in CATEGORIES else "other"