import os
import ssl

from dotenv import load_dotenv
from sqlalchemy.engine import URL
from sqlmodel import Session, create_engine

load_dotenv()

DATABASE_URL = URL.create(
    drivername="postgresql+pg8000",
    username=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    host=os.environ["DB_HOST"],
    port=int(os.environ.get("DB_PORT", "5432")),
    database=os.environ["DB_NAME"],
)

# RDS Postgres usually requires SSL. This encrypts the connection but does not
# verify the certificate
_ssl = ssl.create_default_context()
_ssl.check_hostname = False
_ssl.verify_mode = ssl.CERT_NONE

engine = create_engine(
    DATABASE_URL,
    connect_args={"ssl_context": _ssl},
    pool_pre_ping=True,
    pool_size=2,
    max_overflow=0,
)


def get_session():
    with Session(engine) as session:
        yield session