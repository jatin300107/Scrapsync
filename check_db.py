# check_db.py
from sqlalchemy import inspect


from app.backend import models  # noqa: F401
from app.backend.db import engine

insp = inspect(engine)
for table in insp.get_table_names():
    cols = [c["name"] for c in insp.get_columns(table)]
    print(table, cols)