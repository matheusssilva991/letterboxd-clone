import type { PaginatedResponse } from "@/types/api";

export function getPaginatedItems<T>(
  response: PaginatedResponse<T> | null,
): T[] {
  return Array.isArray(response?.data) ? response.data : [];
}
