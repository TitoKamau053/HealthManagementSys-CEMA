import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.connection import db

async def migrate_data():
    # Sample data for programs
    programs = [
        {"name": "Diabetes Management", "description": "Program for managing diabetes"},
        {"name": "Cardiac Care", "description": "Program for heart health"},
        {"name": "Weight Loss", "description": "Program for weight management"},
    ]

    # Insert programs if not already present
    program_ids = {}
    for program in programs:
        existing = await db.programs.find_one({"name": program["name"]})
        if not existing:
            result = await db.programs.insert_one(program)
            program_id = str(result.inserted_id)
            program_ids[program["name"]] = program_id
            print(f"Inserted program: {program['name']} with id {program_id}")
        else:
            program_ids[program["name"]] = str(existing["_id"])
            print(f"Program already exists: {program['name']} with id {program_ids[program['name']]}")

    # Sample data for clients with Kenyan names
    clients = [
        {
            "first_name": "James",
            "last_name": "Omondi",
            "email": "james.omondi@example.com",
            "enrolled_programs": []
        },
        {
            "first_name": "Mary",
            "last_name": "Wanjiku",
            "email": "mary.wanjiku@example.com",
            "enrolled_programs": []
        }
    ]

    # Insert clients if not already present and enroll them in programs
    for client in clients:
        existing = await db.clients.find_one({"email": client["email"]})
        if not existing:
            # Enroll James Omondi in Diabetes Management and Cardiac Care
            if client["first_name"] == "James":
                client["enrolled_programs"] = [program_ids.get("Diabetes Management"), program_ids.get("Cardiac Care")]
            # Enroll Mary Wanjiku in Weight Loss
            elif client["first_name"] == "Mary":
                client["enrolled_programs"] = [program_ids.get("Weight Loss")]
            result = await db.clients.insert_one(client)
            print(f"Inserted client: {client['email']} with enrolled programs {client['enrolled_programs']}")
        else:
            print(f"Client already exists: {client['email']}")

if __name__ == "__main__":
    asyncio.run(migrate_data())
