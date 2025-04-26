from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class ClientBase(BaseModel):
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")

class ClientCreate(ClientBase):
    pass

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class ProgramSummary(BaseModel):
    id: str
    name: str

class ClientBase(BaseModel):
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")

class ClientCreate(ClientBase):
    pass

class ClientInDB(ClientBase):
    id: str
    enrolled_programs: Optional[List[str]] = []

    class Config:
        orm_mode = True

class ClientProfile(ClientBase):
    id: str
    enrolled_programs: Optional[List[ProgramSummary]] = []

    class Config:
        orm_mode = True
