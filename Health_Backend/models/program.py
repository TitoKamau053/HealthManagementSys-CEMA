from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class ProgramBase(BaseModel):
    name: str = Field(..., example="Diabetes Management")
    description: Optional[str] = Field(None, example="A program for managing diabetes")

class ProgramCreate(ProgramBase):
    pass

class ProgramInDB(ProgramBase):
    id: str

    class Config:
        orm_mode = True
