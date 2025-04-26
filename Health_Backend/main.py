from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    database_name: str = "health_system"

settings = Settings()

app = FastAPI(title="Health Information System API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
client = AsyncIOMotorClient(settings.mongodb_uri)
db = client[settings.database_name]

@app.get("/")
async def root():
    return {"message": "Health Information System API is running"}

from routes.programs import router as programs_router
from routes.clients import router as clients_router

app.include_router(programs_router)
app.include_router(clients_router)
