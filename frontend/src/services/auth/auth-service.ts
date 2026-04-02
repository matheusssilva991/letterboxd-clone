import axios from "axios";
import { apiClient } from "../api-client";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../../types/auth-type";
import { env } from "@/lib/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export async function loginService(payload: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data;
}

export async function registerService(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await axios.post(`${API_URL}/users`, payload);
  return response.data;
}

export async function refreshAccessTokenService(
  refreshToken: string,
): Promise<{ access_token: string; expiresIn: string }> {
  const response = await axios.post(`${API_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  return response.data;
}

export async function logoutService(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string | string[] } | undefined;
    const message = payload?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
