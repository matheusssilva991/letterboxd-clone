// Resposta esperada do registro
export interface RegisterResponse {
  user: AuthUser;
  // Adicione outros campos conforme resposta real da sua API, se necessário
}

export interface AuthUser {
  id?: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, userData: AuthUser) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Tipos da API (Payloads e Responses)
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expiresIn: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}