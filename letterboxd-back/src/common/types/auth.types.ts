export interface JwtPayload {
  sub: number;
  iss: string;
  iat: number;
  exp?: number;
  name: string;
  email: string;
  username: string;
  role: string;
}

export interface GeneratedToken {
  expiresIn: string;
  access_token: string;
  refresh_token: string;
}
