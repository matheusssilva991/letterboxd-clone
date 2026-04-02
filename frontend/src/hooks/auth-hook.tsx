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
import {
  logoutService,
  refreshAccessTokenService,
} from "@/services/auth/auth-service";

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
      captcha: false,
    },
  });
}

// --- AUTH CONTEXT ---
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("letterboxd-token");
    const refreshToken = localStorage.getItem("letterboxd-refresh-token");
    const storedUser = localStorage.getItem("letterboxd-user");

    const loadSession = async () => {
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;

        // Sem access token, tenta renovar com refresh token para restaurar sessão
        if (!token && refreshToken) {
          const refreshed = await refreshAccessTokenService(refreshToken);
          sessionStorage.setItem("letterboxd-token", refreshed.access_token);
        }

        setUser(parsedUser);
      } catch {
        sessionStorage.removeItem("letterboxd-token");
        localStorage.removeItem("letterboxd-refresh-token");
        localStorage.removeItem("letterboxd-user");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    userData: AuthUser,
  ) => {
    sessionStorage.setItem("letterboxd-token", accessToken);
    localStorage.setItem("letterboxd-refresh-token", refreshToken);
    localStorage.setItem("letterboxd-user", JSON.stringify(userData));
    setUser(userData);
    router.refresh();
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch {
      // Mesmo com falha de rede, sessão local deve ser encerrada
    }

    sessionStorage.removeItem("letterboxd-token");
    localStorage.removeItem("letterboxd-refresh-token");
    localStorage.removeItem("letterboxd-user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }

  return context;
}
