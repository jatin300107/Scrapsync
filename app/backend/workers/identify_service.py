import base64
import json
import logging
import os
import time
import urllib.error
import urllib.request
from typing import List

from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError, field_validator

from app.backend.constants import CATEGORIES, CATEGORY_KEYS, normalize_category

load_dotenv()
logger = logging.getLogger(__name__)

URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
PRIMARY_MODEL = "gemini-3.1-flash-lite"
FALLBACK_MODEL = "gemini-3.8-flash"
PRIMARY_TIMEOUT_S = 25
TOTAL_BUDGET_S = 50  # keep below the Lambda timeout

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


class IdentificationError(Exception):
    """Raised when identification fails. The endpoint turns it into a 502."""


SCHEMA = Detection.model_json_schema()


def call_gemini(jpeg_bytes: bytes, model: str, timeout: float) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise IdentificationError("GEMINI_API_KEY is not set")

    payload = {
        "model": model,
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
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:  # must come before OSError
        body = e.read().decode("utf-8", errors="replace")[:500]
        raise IdentificationError(f"{model} returned HTTP {e.code}: {body}") from e
    except (OSError, json.JSONDecodeError) as e:  # timeouts, DNS, connection resets
        raise IdentificationError(f"{model} failed: {e}") from e


def _extract_text(data: dict) -> str:
    if data.get("status") != "completed":
        raise IdentificationError(f"Interaction not completed: {data.get('status')}")
    for step in reversed(data.get("steps", [])):
        if step.get("type") != "model_output":
            continue  # skip 'thought' steps
        for part in step.get("content", []):
            if part.get("type") == "text" and part.get("text"):
                return part["text"]
    raise IdentificationError("No model_output text in Gemini response")
def parse_items(text: str) -> List[DetectedItem]:
    try:
        raw_items = json.loads(text)["items"]
        if not isinstance(raw_items, list):
            raise TypeError("items is not a list")
    except (json.JSONDecodeError, KeyError, TypeError) as e:
        raise IdentificationError(f"Unparseable model output: {e}") from e

    items: List[DetectedItem] = []
    for raw in raw_items:
        try:
            items.append(DetectedItem.model_validate(raw))
        except ValidationError as e:
            logger.warning("Dropping invalid item %r: %s", raw, e)
    return items


def identify_image(jpeg_bytes: bytes) -> List[DetectedItem]:
    start = time.monotonic()
    attempts = [(PRIMARY_MODEL, PRIMARY_TIMEOUT_S), (FALLBACK_MODEL, None)]
    last_error = None

    for model, cap in attempts:
        remaining = TOTAL_BUDGET_S - (time.monotonic() - start)
        if remaining < 5:
            break
        timeout = min(cap or remaining, remaining)
        try:
            data = call_gemini(jpeg_bytes, model, timeout)
            return parse_items(_extract_text(data))
        except IdentificationError as e:
            logger.warning("%s failed: %s", model, e)
            last_error = e

    raise IdentificationError(f"All models failed: {last_error}")