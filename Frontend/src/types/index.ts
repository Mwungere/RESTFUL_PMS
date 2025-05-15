export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'CLIENT';
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  slotNumber: number | null;
  ownerId: string;
  registeredAt: string;
  lastUpdated: string;
  owner?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface VehicleFormData {
  plateNumber: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 