# Health Information System - Frontend

## Overview

This is the frontend application for the Health Information System. It is built using React and TypeScript, providing a user interface to manage health programs and clients. The frontend interacts with a backend API to perform CRUD operations, client registration, program enrollment, and more.

## Features

- React + TypeScript SPA
- Manage health programs: create, search, and delete programs
- Client registration with form validation
- Search clients and view client details
- Responsive design with dark mode support
- Integration with backend API for data persistence
- User-friendly alerts and loading indicators

## Project Structure

- `src/pages/`: Contains page components such as Programs, ClientRegistration, Dashboard, etc.
- `src/components/`: Reusable UI components like Navbar, ProgramCard, AlertMessage, etc.
- `src/services/api.ts`: API service for communicating with the backend.
- `src/types/`: TypeScript type definitions.
- `src/context/`: React context providers, e.g., ThemeContext.
- `src/index.tsx`: Application entry point.
- `src/App.tsx`: Main app component with routing.

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open the application**

Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

- Navigate to the "Programs" page to create, search, and delete health programs.
- Use the "Register Client" page to add new clients with validated email input.
- Use the search functionality in clients and programs to quickly find records.
- Toggle dark mode using the icon in the navbar.
- The navbar background color matches the body for a seamless look.

## Dependencies

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Lucide React (icons)

## License

This project is open source and free to use.

## Contact

For questions or support, please contact me via email: titusmainakamau053@gmail.com.
