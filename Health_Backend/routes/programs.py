from fastapi import APIRouter, HTTPException
from models.program import ProgramCreate, ProgramInDB
from db.connection import db
from bson import ObjectId
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/programs", tags=["programs"])

def validate_object_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

@router.post("/", response_model=ProgramInDB)
async def create_program(program: ProgramCreate):
    print("create_program called")
    program_dict = program.dict()
    result = await db.programs.insert_one(program_dict)
    created_program = await db.programs.find_one({"_id": result.inserted_id})
    created_program["id"] = str(created_program["_id"])
    return ProgramInDB(**created_program)

@router.get("/", response_model=list[ProgramInDB])
async def list_programs():
    print("list_programs called")
    program_cursor = db.programs.find()
    programs = []
    async for program in program_cursor:
        program["id"] = str(program["_id"])
        programs.append(ProgramInDB(**program))
    return programs

@router.get("/{program_id}", response_model=ProgramInDB)  
async def get_program(program_id: str):
    print(f"get_program called with program_id: {program_id}")
    validate_object_id(program_id)
    program = await db.programs.find_one({"_id": ObjectId(program_id)})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    program["id"] = str(program["_id"])
    return ProgramInDB(**program)

@router.post("/{program_id}/enroll")
async def enroll_user(program_id: str, client_id: str):
    # Validate program exists
    program = await db.programs.find_one({"_id": ObjectId(program_id)})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Validate client exists
    client = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Initialize enrolled_programs if it doesn't exist
    if "enrolled_programs" not in client:
        client["enrolled_programs"] = []
    
    # Check if client is already enrolled
    if program_id in client["enrolled_programs"]:
        raise HTTPException(status_code=400, detail="Client already enrolled in this program")
    
    # Add program to client's enrolled_programs
    await db.clients.update_one(
        {"_id": ObjectId(client_id)},
        {"$addToSet": {"enrolled_programs": program_id}}
    )
    
    # Return updated client
    updated_client = await db.clients.find_one({"_id": ObjectId(client_id)})
    updated_client["id"] = str(updated_client["_id"])
    return {"message": "Successfully enrolled", "client": updated_client}

@router.delete("/{program_id}")
async def delete_program(program_id: str):
    validate_object_id(program_id)
    program = await db.programs.find_one({"_id": ObjectId(program_id)})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    # Delete the program
    await db.programs.delete_one({"_id": ObjectId(program_id)})
    # Remove the program from all clients' enrolled_programs lists
    await db.clients.update_many(
        {"enrolled_programs": program_id},
        {"$pull": {"enrolled_programs": program_id}}
    )
    return {"message": "Program deleted successfully"}
    
