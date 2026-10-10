from sqlmodel import SQLModel

from app.backend import models  # noqa: F401
from app.backend.db import engine

if __name__ == "__main__":
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    print("schema reset")