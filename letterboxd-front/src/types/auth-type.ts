// Resposta esperada do registro
export interface RegisterResponse {
  user: AuthUser;
  // Adicione outros campos conforme resposta real da sua API, se necessário
}

export interface AuthUser {
  username: string;
  email: string;
  // token?: string; // Se quiser salvar o token no objeto de usuário também
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

// Tipos da API (Payloads e Responses)
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser; // Supondo que sua API retorne o usuário junto
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}