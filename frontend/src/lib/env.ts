import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

const fallbackApiUrl = "http://localhost:3001/api";

if (!parsed.success && process.env.NODE_ENV !== "production") {
  console.warn("Variáveis de ambiente inválidas. Usando fallback local da API.");
}

export const env = {
  NEXT_PUBLIC_API_URL:
    parsed.success && parsed.data.NEXT_PUBLIC_API_URL
      ? parsed.data.NEXT_PUBLIC_API_URL
      : fallbackApiUrl,
};
