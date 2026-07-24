export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PersonSummary {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  synopsis: string;
  duration: number;
  releaseDate: string;
  imagePath: string | null;
  genres?: PersonSummary[];
  directors?: PersonSummary[];
  actors?: PersonSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewUser {
  id: number;
  name: string | null;
  username: string;
}

export interface MovieReview {
  id: number;
  stars: number;
  comment: string;
  movieId: number;
  userId: number;
  movie?: Pick<Movie, "id" | "title" | "imagePath">;
  user?: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  name: string | null;
  email: string;
  username: string;
  role: "admin" | "user";
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: number;
  name: string;
  description: string;
  imagePath: string | null;
  movies?: Movie[];
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: number;
  name: string;
}
