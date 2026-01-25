"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
  registerSchemaWithChecks,
  RegisterFormDataWithChecks,
} from "@/schemas/auth-schema";
import type { AuthUser, AuthContextType } from "@/types/auth-type";

// --- FORM HOOKS (Utilitários) ---
export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
}

export function useRegisterForm() {
  return useForm<RegisterFormDataWithChecks>({
    resolver: zodResolver(registerSchemaWithChecks),
    mode: "onChange",
    defaultValues: {
      ageTerms: false,
      privacy: false,
      captcha: false
    }
  });
}

// --- AUTH CONTEXT ---
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carrega do localStorage apenas no lado do cliente
    const token = localStorage.getItem("letterboxd-token");
    const storedUser = localStorage.getItem("letterboxd-user");

    if (token && storedUser) {
      try {
        // Evita renderização em cascata usando microtask
        Promise.resolve().then(() => setUser(JSON.parse(storedUser)));
      } catch (error) {
        console.error("Erro ao ler usuário do storage", error);
        // Se o JSON estiver corrompido, é bom limpar
        localStorage.removeItem("letterboxd-token");
        localStorage.removeItem("letterboxd-user");
      }
    }
    Promise.resolve().then(() => setIsLoading(false));
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem("letterboxd-token", token);
    localStorage.setItem("letterboxd-user", JSON.stringify(userData));
    setUser(userData);
    router.refresh(); // Atualiza componentes do servidor (Server Components)
  };

  const logout = () => {
    localStorage.removeItem("letterboxd-token");
    localStorage.removeItem("letterboxd-user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}