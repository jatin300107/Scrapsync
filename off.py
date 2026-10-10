# one-off, run once
from sqlalchemy import text
from app.backend.db import engine

with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS ping, scans"))