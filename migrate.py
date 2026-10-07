from backend.app import models
import asyncio
from backend.app.db import create_db

if __name__ == "__main__":
    asyncio.run(create_db())