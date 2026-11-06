import { getApiClient } from './client';

// Stub API calls for the upstream User Management System API. Request/response
// schemas are owned upstream and will be added (with zod validation) during
// feature build-out. Paths are relative to VITE_API_BASE_URL.

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const umsApi = {
  register: (body: RegisterRequest) => getApiClient().post('/api/users/register', body),
  verifyOtp: (body: VerifyOtpRequest) => getApiClient().post('/api/users/verify-otp', body),
  login: (body: LoginRequest) => getApiClient().post('/api/auth/login', body),
  logout: () => getApiClient().post('/api/auth/logout'),
  getDashboard: () => getApiClient().get('/api/dashboard'),
  getProfile: () => getApiClient().get('/api/users/me'),
  deleteAccount: () => getApiClient().delete('/api/users/me'),
};
