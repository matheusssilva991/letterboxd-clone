import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
  registerSchemaWithChecks,
  RegisterFormDataWithChecks,
} from "@/schemas/auth-schema";

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
  });
}
