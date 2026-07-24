import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const API_URL = `${configuredApiUrl.replace(/\/$/, "").replace(/\/v1$/, "")}/v1`;

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

function getAccessToken() {
  return typeof window !== "undefined"
    ? sessionStorage.getItem("letterboxd-token")
    : null;
}

function getRefreshToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("letterboxd-refresh-token")
    : null;
}

function clearAuthStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("letterboxd-token");
  localStorage.removeItem("letterboxd-refresh-token");
  localStorage.removeItem("letterboxd-user");
}

function readErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload
  ) {
    const message = payload.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return "Não foi possível concluir a solicitação.";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const refreshToken = getRefreshToken();

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      !refreshToken
    ) {
      if (!refreshToken && error.response?.status === 401) clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post<{ access_token?: string }>(
        `${API_URL}/auth/refresh`,
        { refresh_token: refreshToken },
      );
      const accessToken = response.data.access_token;
      if (!accessToken) throw new Error("Resposta de refresh inválida.");

      sessionStorage.setItem("letterboxd-token", accessToken);
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      return Promise.reject(refreshError);
    }
  },
);

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  new Headers(init.headers).forEach((value, key) => {
    headers[key] = value;
  });

  if (init.body && !(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await apiClient.request<T>({
      url: path,
      method: init.method ?? "GET",
      data: init.body,
      headers,
      signal: init.signal ?? undefined,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        readErrorMessage(error.response?.data),
        error.response?.status ?? 0,
      );
    }
    throw error;
  }
}
