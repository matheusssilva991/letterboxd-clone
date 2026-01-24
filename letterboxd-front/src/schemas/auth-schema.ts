import { z } from "zod";

// --- LOGIN SCHEMA ---
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
  captcha: z.literal(true, { message: "Confirme que você é humano" }),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// --- REGISTER SCHEMA BASE ---
export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z.string()
    .min(3, "O usuário deve ter pelo menos 3 letras")
    .regex(/^[a-z0-9_]+$/i, "Apenas letras, números e underline"),
  password: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "Precisa ter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Precisa ter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Precisa ter um caractere especial (!@#$)"),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

// --- REGISTER SCHEMA COM CHECKBOXES ---
export const registerSchemaWithChecks = registerSchema.extend({
  ageTerms: z.literal(true, { message: "Aceite os termos de uso" }),
  privacy: z.literal(true, { message: "Aceite a política de privacidade" }),
  captcha: z.literal(true, { message: "Confirme que você é humano" }),
});
export type RegisterFormDataWithChecks = z.infer<typeof registerSchemaWithChecks>;