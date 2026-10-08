from typing import List 

from pydantic import BaseModel, Field ,field_validator

from app.backend.constants import CATEGORY_KEYS, normalize_category 


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
    """Raised when the identification model fails. The endpoint turns it into a 502."""


def identify_image(jpeg_bytes: bytes) -> List[DetectedItem]:
    # MOCK. Tomorrow the body becomes the real Gemini call and raises
    # IdentificationError on failure. The signature stays the same.
    return [
        DetectedItem(name="Old smartphone", category="mobile_phone", box_2d=[120, 80, 520, 420]),
        DetectedItem(name="Power bank", category="battery", box_2d=[560, 500, 900, 880]),
        DetectedItem(name="Tangled charger cables", category="cable_wire", box_2d=[150, 520, 480, 940]),
    ]