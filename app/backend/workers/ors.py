import math
import os
import json
import urllib.request


def haversine_km(lat1, lon1, lat2, lon2) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 6371.0 * 2 * math.asin(math.sqrt(a))


def distances_for(lat, lon, recyclers: list) -> list:
    """[(km, is_approximate)] one per recycler. One ORS request, haversine on any failure."""
    if lat is None or lon is None:
        return [(None, False)] * len(recyclers)
    fallback = [(round(haversine_km(lat, lon, r.latitude, r.longitude), 1), True) for r in recyclers]
    key = os.environ.get("ORS_API_KEY")
    if not key or not recyclers:
        return fallback
    body = {
        "locations": [[lon, lat]] + [[r.longitude, r.latitude] for r in recyclers],  # [lon, lat]
        "sources": [0],
        "destinations": list(range(1, len(recyclers) + 1)),
        "metrics": ["distance"],
        "units": "km",
    }
    try:
        req = urllib.request.Request(
            "https://api.openrouteservice.org/v2/matrix/driving-car",
            data=json.dumps(body).encode("utf-8"),
            headers={"Authorization": key, "Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            row = json.loads(resp.read().decode("utf-8"))["distances"][0]
        return [
            (round(d, 1), False) if d is not None else fallback[i]
            for i, d in enumerate(row)
        ]
    except Exception:
        return fallback