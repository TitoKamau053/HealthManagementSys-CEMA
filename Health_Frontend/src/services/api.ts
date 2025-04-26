import axios from 'axios';
import { Program, Client, ProgramCreate, ClientCreate } from '../types';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Programs
export const createProgram = async (program: ProgramCreate): Promise<Program> => {
  const response = await api.post('/programs/', program);
  return response.data;
};

export const getPrograms = async (): Promise<Program[]> => {
  const response = await api.get('/programs/');
  return response.data;
};

export const deleteProgram = async (programId: string): Promise<void> => {
  await api.delete(`/programs/${programId}`);
};

// Clients
export const createClient = async (client: ClientCreate): Promise<Client> => {
  const response = await api.post('/clients/', client);
  return response.data;
};

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients/');
  return response.data;
};

export const getClient = async (id: string): Promise<Client> => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const enrollClient = async (clientId: string, programIds: string[]): Promise<void> => {
  await api.post(`/clients/${clientId}/enroll`, programIds);
};

export const removeEnrolledProgram = async (clientId: string, programId: string): Promise<void> => {
  await api.post(`/clients/${clientId}/unenroll`, [programId]);
};

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await api.get('/clients/');
  const clients = response.data;
  
  if (!query) return clients;
  
  // Client-side filtering (replace with server-side if API supports it)
  return clients.filter((client: Client) => 
    client.first_name.toLowerCase().includes(query.toLowerCase()) ||
    client.last_name.toLowerCase().includes(query.toLowerCase()) ||
    client.email.toLowerCase().includes(query.toLowerCase())
  );
};

export default api;
