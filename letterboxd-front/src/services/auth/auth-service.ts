import axios from 'axios';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '../../types/auth-type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  // O backend espera email e password
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  console.log("Response data:", response.data);
  return response.data;
}

export async function registerService(payload: RegisterPayload): Promise<RegisterResponse> {
  // O backend espera email, username e password
  const response = await axios.post(`${API_URL}/users`, payload);
  console.log("Response data:", response.data);
  return response.data;
}
