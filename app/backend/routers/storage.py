import os
import uuid

import boto3
from botocore.config import Config
from dotenv import load_dotenv

load_dotenv()

_BUCKET = os.environ["S3_BUCKET"]
_s3 = boto3.client(
    "s3",
    region_name=os.environ.get("AWS_REGION"),
    config=Config(signature_version="s3v4"),
)


def upload_image(jpeg_bytes: bytes) -> str:
    key = f"lots/{uuid.uuid4()}.jpg"
    _s3.put_object(Bucket=_BUCKET, Key=key, Body=jpeg_bytes, ContentType="image/jpeg")
    return key


def image_url(key: str) -> str:
    return _s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": _BUCKET, "Key": key},
        ExpiresIn=3600,
    )