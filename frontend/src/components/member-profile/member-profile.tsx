"use client";

import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import type { UserProfile } from "@/types/api";

interface MemberProfileProps {
  memberId: string;
}

export function MemberProfile({ memberId }: MemberProfileProps) {
  const { data, error, isLoading } = useApiResource<UserProfile>(
    `/users/${memberId}`,
  );

  if (isLoading) {
    return <Skeleton className="mx-auto h-64 w-full max-w-3xl bg-white/10" />;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Membro não encontrado</h1>
        <p className="mt-2 text-letterboxd-label">{error}</p>
        <Button asChild className="mt-6 bg-letterboxd-green text-white">
          <Link href="/members">Ver membros</Link>
        </Button>
      </div>
    );
  }

  const joinedAt = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(data.createdAt));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
      <section className="overflow-hidden rounded-md border border-white/10 bg-[#14181c]">
        <div className="h-28 bg-[radial-gradient(circle_at_25%_0%,rgba(64,188,244,0.35),transparent_30%),linear-gradient(120deg,#25313b,#14181c)]" />
        <div className="flex flex-col items-center gap-5 px-6 pb-8 sm:flex-row sm:items-end">
          <div className="-mt-12 grid h-28 w-28 shrink-0 place-items-center rounded-full border-4 border-[#14181c] bg-[#445566] text-white">
            <UserRound className="h-12 w-12" aria-hidden="true" />
          </div>
          <div className="text-center sm:pb-2 sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-letterboxd-green">
              {data.role === "admin" ? "Administrador" : "Membro"}
            </p>
            <h1 className="mt-1 text-3xl font-black text-white">
              {data.name || data.username}
            </h1>
            <p className="text-letterboxd-label">@{data.username}</p>
          </div>
          <p className="inline-flex items-center gap-2 text-xs text-letterboxd-label sm:ml-auto sm:pb-3">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Membro desde {joinedAt}
          </p>
        </div>
      </section>
    </div>
  );
}
