# test_identify.py  usage: python test_identify.py photo1.jpg photo2.jpg ...
import base64
import json
import os
import sys
import time
import urllib.error
from typing import List
import urllib.request
from io import BytesIO
from pydantic import BaseModel, Field, field_validator
from app.backend.constants import CATEGORY_KEYS, normalize_category , CATEGORIES
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageOps


load_dotenv()
API_KEY = os.environ["GEMINI_API_KEY"]
MODEL = os.environ["GEMINI_MODEL"]
print(MODEL)
URL = "https://generativelanguage.googleapis.com/v1beta/interactions"

category_lines = "\n".join(f"- {k}: {v}" for k, v in CATEGORIES.items())
PROMPT = f"""You help an informal e-waste collector in India sort discarded electronics.
Detect every distinct recyclable e-waste item visible in the image.
For each item return:
- name: a short descriptive name, for example "cracked Samsung smartphone"
- category: exactly one key from this list:
{category_lines}
- box_2d: [ymin, xmin, ymax, xmax] normalized to 0-1000
Ignore anything that is not electronic or electrical waste (furniture, bags, people, floor).
If no e-waste is visible, return an empty list."""

class DetectedItem(BaseModel):
    name: str = Field(description="Short descriptive name, for example 'cracked Samsung smartphone'.")
    category: str = Field(description="Exactly one of: " + ", ".join(CATEGORY_KEYS))
    box_2d: List[int] = Field(description="[ymin, xmin, ymax, xmax] normalized to 0-1000.")

    @field_validator("category", mode="before")
    @classmethod
    def _normalize(cls, v):
        return normalize_category(v)

    @field_validator("box_2d")
    @classmethod
    def _check_box(cls, v):
        if len(v) != 4:
            raise ValueError("box_2d needs exactly 4 numbers")
        ymin, xmin, ymax, xmax = [max(0, min(1000, n)) for n in v]
        if ymin >= ymax or xmin >= xmax:
            raise ValueError("box_2d is empty or inverted")
        return [ymin, xmin, ymax, xmax]


class Detection(BaseModel):
    items: List[DetectedItem]

SCHEMA = Detection.model_json_schema()
def prepare(path):
    """Mirror the app: fix rotation, longest side 1600 px, JPEG quality 80."""
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    img.thumbnail((1600, 1600))
    buf = BytesIO()
    img.save(buf, "JPEG", quality=80)
    return img, buf.getvalue()


def call_gemini(jpeg_bytes):
    payload = {
        "model": "gemini-3.1-flash-lite",
        "input": [
            {"type": "text", "text": PROMPT},
            {
                "type": "image",
                "data": base64.b64encode(jpeg_bytes).decode("utf-8"),
                "mime_type": "image/jpeg",
            },
        ],
        "response_format": {
            "type": "text",
            "mime_type": "application/json",
            "schema": SCHEMA,
        },
        "generation_config": {"thinking_level": "high"},
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": API_KEY},
        method="POST",
    )
    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(data)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode("utf-8"))
        return None, 0
    return data, time.time() - start


def find_items(node):
    """TEST ONLY. Walks the raw response and returns the first JSON string that has an 'items' key.
    The production endpoint will read the exact field once the raw shape is confirmed."""
    if isinstance(node, str):
        try:
            obj = json.loads(node)
        except ValueError:
            return None
        return obj if isinstance(obj, dict) and "items" in obj else None
    children = node.values() if isinstance(node, dict) else node if isinstance(node, list) else []
    for child in children:
        found = find_items(child)
        if found:
            return found
    return None


def draw(img, items, out_path):
    img = img.copy()
    w, h = img.size
    d = ImageDraw.Draw(img)
    for it in items:
        ymin, xmin, ymax, xmax = it.box_2d
        box = [xmin / 1000 * w, ymin / 1000 * h, xmax / 1000 * w, ymax / 1000 * h]
        d.rectangle(box, outline="red", width=4)
        d.text((box[0] + 4, box[1] + 4), f"{it.category}: {it.name}", fill="red")
    img.save(out_path)


if __name__ == "__main__":
    for i, path in enumerate(sys.argv[1:]):
        img, jpeg = prepare(path)
        data, secs = call_gemini(jpeg)
        if data is None:
            continue
        if i == 0:
            print("RAW RESPONSE (first image only):")
            print(json.dumps(data, indent=2)[:4000])
        parsed = find_items(data)
        print(f"\n{path}: {secs:.1f}s, {len(jpeg) // 1024} KB sent, model {MODEL}")
        if not parsed:
            print("  could not find items in the response")
            continue

        good = []
        for raw in parsed["items"]:
            try:
                good.append(DetectedItem.model_validate(raw))
            except ValueError as e:
                print("   dropped:", raw, "-", e)
        for it in good:
            print("  ", it.category, "|", it.name, "|", it.box_2d)
        draw(img, good, "out_" + os.path.basename(path))
        print("  saved out_" + os.path.basename(path))
