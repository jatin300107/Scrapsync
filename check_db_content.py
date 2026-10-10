from sqlmodel import Session, select, func
from app.backend.db import engine
from app.backend.models import Recycler, RecyclerRate , SafetyGuideline

with Session(engine) as s:
    print(s.exec(select(func.count()).select_from(Recycler)).one())      # expect 5
    print(s.exec(select(func.count()).select_from(RecyclerRate)).one())
    print(s.exec(select(func.count()).select_from(SafetyGuideline)).one())  # expect about 34