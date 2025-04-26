# Health Information System - Backend API

## Overview

This is a backend API for a Health Information System built using FastAPI and MongoDB Atlas. The API manages health programs and clients, allowing creation, enrollment, unenrollment, and retrieval of client profiles and programs. The system is fully asynchronous for performance and scalability.

## Features

- Async REST API built with FastAPI
- MongoDB Atlas integration using Motor (async MongoDB driver)
- CRUD operations for health programs and clients
- Client enrollment into multiple health programs
- Client unenrollment from health programs
- Program deletion with automatic removal from clients' enrollments
- Swagger UI auto-generated API documentation
- CORS support for frontend integration
- Environment variable support via `.env`
- Data migration script to seed initial sample data
- Basic validation and error handling

## Project Structure

- `main.py`: Application entry point, sets up FastAPI app, MongoDB connection, and routes.
- `db/connection.py`: MongoDB client and database connection setup.
- `models/`: Pydantic models for programs and clients.
- `routes/`: API route handlers for programs and clients.
- `scripts/data_migration.py`: Script to insert initial sample data into MongoDB.
- `.env`: Environment variables including MongoDB URI.
- `requirements.txt`: Python dependencies.
- `document.txt`: Detailed project documentation.

## Setup Instructions

1. **Clone the repository**

2. **Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Create a `.env` file**

Add your MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

Replace `<username>` and `<password>` with your credentials.

5. **Run data migration script to seed initial data**

```bash
python scripts/data_migration.py
```

6. **Start the FastAPI server**

```bash
uvicorn main:app --reload
```

7. **Access the API documentation**

Open your browser and navigate to:

```
http://localhost:8000/docs
```

## API Endpoints

- `GET /` - Root endpoint, health check.
- `POST /programs/` - Create a new health program.
- `DELETE /programs/{program_id}` - Delete a health program and remove it from all clients.
- `POST /programs/{program_id}/enroll` - Enroll a client into a program.
- `POST /clients/` - Register a new client.
- `POST /clients/{client_id}/enroll` - Enroll client into one or more programs.
- `POST /clients/{client_id}/unenroll` - Unenroll client from one or more programs.
- `GET /clients/` - List all clients with enrolled program names.
- `GET /clients/{client_id}` - Get client profile with enrolled program names.
- `GET /api/client-profile/{client_id}` - Public access to client profile with enrolled program names.

## Usage Notes

- All endpoints expect and return JSON.
- Client and program IDs are MongoDB ObjectId strings.
- Use the Swagger UI for interactive API exploration.
- Ensure your MongoDB Atlas cluster is accessible from your environment.

## Dependencies

- FastAPI
- Uvicorn
- Motor
- Pydantic
- python-dotenv

## License

This project is open source and free to use developed by Titus Maina Kamau.

## Contact

For questions or support, please contact me via my email: titusmainakamau053@gmail.com.
