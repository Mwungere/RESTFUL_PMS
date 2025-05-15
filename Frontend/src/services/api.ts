import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials, Vehicle, VehicleFormData } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

// Vehicles API
export const getUserVehicles = async (page = 1, limit = 10): Promise<Vehicle[]> => {
  const { data } = await api.get<Vehicle[]>(`/vehicles/my-vehicles?page=${page}&limit=${limit}`);
  return data;
};

export const getAllVehicles = async (page = 1, limit = 10, status?: string): Promise<Vehicle[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (status) {
    params.append('status', status);
  }

  const { data } = await api.get<Vehicle[]>(`/vehicles?${params.toString()}`);
  return data;
};

export const addVehicle = async (vehicleData: VehicleFormData) => {
  const { data } = await api.post<Vehicle>('/vehicles/register', vehicleData);
  return data;
};

export const deleteVehicle = async (id: string) => {
  await api.delete(`/vehicles/${id}`);
};

export const updateVehicleStatus = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
  const { data } = await api.patch<Vehicle>(`/vehicles/${id}/status`, { status });
  return data;
};

export default api; 