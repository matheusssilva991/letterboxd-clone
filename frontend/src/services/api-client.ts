import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/lib/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

const getAccessToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("letterboxd-token")
    : null;

const getRefreshToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("letterboxd-refresh-token")
    : null;

const persistAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("letterboxd-token", token);
  }
};

const clearAuthStorage = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("letterboxd-token");
    localStorage.removeItem("letterboxd-refresh-token");
    localStorage.removeItem("letterboxd-user");
  }
};

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const isUnauthorized = error.response?.status === 401;

    if (!originalRequest || !isUnauthorized || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const newAccessToken = refreshResponse.data?.access_token as string | undefined;

      if (!newAccessToken) {
        throw new Error("Invalid refresh response");
      }

      persistAccessToken(newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  },
);
