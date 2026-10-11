from sqlmodel import Session, select, delete, func

# Adjust these two imports to match your project.
from app.backend.models import Lot, Audit
from app.backend.db import engine


def clear_lots():
    with Session(engine) as session:
        n_lots = session.exec(select(func.count()).select_from(Lot)).one()
        n_audits = session.exec(select(func.count()).select_from(Audit)).one()
        print(f"About to delete {n_lots} lots and {n_audits} audits")
        if input("Type YES to continue: ") != "YES":
            print("Cancelled")
            return

        session.exec(delete(Audit))  # audits first, they reference lots
        session.exec(delete(Lot))
        session.commit()
        print("Done")


if __name__ == "__main__":
    clear_lots()