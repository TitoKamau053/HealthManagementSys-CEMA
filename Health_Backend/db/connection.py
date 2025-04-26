from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = "health_system"

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]
