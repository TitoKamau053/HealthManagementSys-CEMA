from fastapi import APIRouter, HTTPException
from typing import List
from models.client import ClientCreate, ClientProfile
from models.program import ProgramInDB
from db.connection import db
from bson import ObjectId

router = APIRouter(prefix="/clients", tags=["clients"])

def validate_object_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

@router.post("/", response_model=ClientProfile)
async def register_client(client: ClientCreate):
    print("register_client called")
    client_dict = client.dict()
    client_dict["enrolled_programs"] = []
    result = await db.clients.insert_one(client_dict)
    created_client = await db.clients.find_one({"_id": result.inserted_id})
    created_client["id"] = str(created_client["_id"])
    # Convert enrolled_programs IDs to ProgramSummary list
    enrolled_programs = []
    for pid in created_client.get("enrolled_programs", []):
        program = await db.programs.find_one({"_id": ObjectId(pid)})
        if program:
            enrolled_programs.append({"id": str(program["_id"]), "name": program["name"]})
    created_client["enrolled_programs"] = enrolled_programs
    return ClientProfile(**created_client)

@router.post("/{client_id}/enroll")
async def enroll_client(client_id: str, program_ids: List[str]):
    validate_object_id(client_id)
    for pid in program_ids:
        validate_object_id(pid)
    client = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    # Update enrolled programs
    enrolled = set(client.get("enrolled_programs", []))
    enrolled.update(program_ids)
    await db.clients.update_one({"_id": ObjectId(client_id)}, {"$set": {"enrolled_programs": list(enrolled)}})
    return {"message": "Client enrolled in programs successfully"}

@router.post("/{client_id}/unenroll")
async def unenroll_client(client_id: str, program_ids: List[str]):
    validate_object_id(client_id)
    for pid in program_ids:
        validate_object_id(pid)
    client = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    # Remove specified programs from enrolled_programs
    enrolled = set(client.get("enrolled_programs", []))
    enrolled.difference_update(program_ids)
    await db.clients.update_one({"_id": ObjectId(client_id)}, {"$set": {"enrolled_programs": list(enrolled)}})
    return {"message": "Client unenrolled from programs successfully"}

@router.get("/", response_model=List[ClientProfile])
async def list_clients():
    print("list_clients called")
    clients_cursor = db.clients.find()
    clients = []
    async for client in clients_cursor:
        client["id"] = str(client["_id"])
        enrolled_programs = []
        for pid in client.get("enrolled_programs", []):
            program = await db.programs.find_one({"_id": ObjectId(pid)})
            if program:
                enrolled_programs.append({"id": str(program["_id"]), "name": program["name"]})
        client["enrolled_programs"] = enrolled_programs
        clients.append(ClientProfile(**client))
    return clients

@router.get("/{client_id}", response_model=ClientProfile)
async def get_client_profile(client_id: str):
    print(f"get_client_profile called with client_id: {client_id}")
    validate_object_id(client_id)
    client = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    client["id"] = str(client["_id"])
    enrolled_programs = []
    for pid in client.get("enrolled_programs", []):
        program = await db.programs.find_one({"_id": ObjectId(pid)})
        if program:
            enrolled_programs.append({"id": str(program["_id"]), "name": program["name"]})
    client["enrolled_programs"] = enrolled_programs
    return ClientProfile(**client)

@router.get("/api/client-profile/{client_id}", response_model=ClientProfile)
async def public_client_profile(client_id: str):
    # Public API access to client profile
    validate_object_id(client_id)
    client = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    client["id"] = str(client["_id"])
    enrolled_programs = []
    for pid in client.get("enrolled_programs", []):
        program = await db.programs.find_one({"_id": ObjectId(pid)})
        if program:
            enrolled_programs.append({"id": str(program["_id"]), "name": program["name"]})
    client["enrolled_programs"] = enrolled_programs
    # Optionally, remove sensitive data here if any
    return ClientProfile(**client)
