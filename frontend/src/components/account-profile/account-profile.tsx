"use client";

import { useState } from "react";
import { Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth-hook";
import { useApiResource } from "@/hooks/use-api-resource";
import { apiFetch } from "@/services/api-client";
import type { UserProfile } from "@/types/api";

export function AccountProfile() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const profile = useApiResource<UserProfile>(
    isAuthenticated ? "/users/me" : null,
  );

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = new FormData();

    for (const field of ["name", "email", "username"] as const) {
      const value = formData.get(field);
      if (typeof value === "string" && value.trim()) {
        payload.set(field, value.trim());
      }
    }

    setIsSaving(true);
    try {
      await apiFetch("/users/me", { method: "PATCH", body: payload });
      profile.reload();
      toast.success("Perfil atualizado.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar o perfil.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isAuthLoading) {
    return <Skeleton className="h-72 bg-white/10" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-md border border-white/10 bg-[#14181c] p-10 text-center">
        <UserRound className="mx-auto h-10 w-10 text-letterboxd-label" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold text-white">Entre na sua conta</h2>
        <p className="mt-2 text-sm text-letterboxd-label">
          Seu perfil e suas configurações ficam disponíveis após o login.
        </p>
        <AuthModal>
          <Button className="mt-6 bg-letterboxd-green font-bold uppercase tracking-wider text-white hover:bg-letterboxd-green-hover">
            Entrar
          </Button>
        </AuthModal>
      </div>
    );
  }

  if (profile.isLoading) {
    return <Skeleton className="h-72 bg-white/10" />;
  }

  if (profile.error || !profile.data) {
    return (
      <p className="rounded-md border border-letterboxd-orange/30 bg-letterboxd-orange/10 p-6 text-white">
        {profile.error ?? "Não foi possível carregar seu perfil."}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-md bg-[#14181c] p-6 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#445566]">
          <UserRound className="h-10 w-10 text-white/60" aria-hidden="true" />
        </div>
        <p className="mt-4 font-bold text-white">@{profile.data.username}</p>
        <p className="mt-1 text-xs uppercase tracking-widest text-letterboxd-green">
          {profile.data.role}
        </p>
      </aside>

      <form
        key={profile.data.updatedAt}
        onSubmit={updateProfile}
        className="rounded-md bg-[#14181c] p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-white">Informações da conta</h2>
        <p className="mt-1 text-sm text-letterboxd-label">
          Atualize os dados públicos e de acesso do seu perfil.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-name" className="text-white">
              Nome
            </Label>
            <Input
              id="profile-name"
              name="name"
              defaultValue={profile.data.name ?? ""}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-username" className="text-white">
              Nome de usuário
            </Label>
            <Input
              id="profile-username"
              name="username"
              defaultValue={profile.data.username}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email" className="text-white">
              E-mail
            </Label>
            <Input
              id="profile-email"
              name="email"
              type="email"
              defaultValue={profile.data.email}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSaving}
          className="mt-7 bg-letterboxd-green font-bold uppercase tracking-wider text-white hover:bg-letterboxd-green-hover"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
