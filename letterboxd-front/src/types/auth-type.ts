export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
  name?: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}
