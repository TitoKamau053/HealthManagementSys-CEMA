// Program Types
export interface Program {
  id: string;
  name: string;
  description?: string;
}

export interface ProgramCreate {
  name: string;
  description?: string;
}

// Client Types
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  gender?: string;
  enrolled_programs: Program[];
}

export interface ClientCreate {
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  gender?: string;
}

// Enrollment Type
export interface EnrollmentRequest {
  program_ids: string[];
}