"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { MoviePoster } from "@/components/movie-poster/movie-poster";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import type { Person } from "@/types/api";

interface PersonProfileProps {
  kind: "actors" | "directors";
  personId: string;
}

export function PersonProfile({ kind, personId }: PersonProfileProps) {
  const { data, error, isLoading } = useApiResource<Person>(
    `/${kind}/${personId}?include=movies`,
  );

  if (isLoading) {
    return <Skeleton className="mx-auto h-80 w-full max-w-5xl bg-white/10" />;
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Pessoa não encontrada</h1>
        <p className="mt-2 text-letterboxd-label">{error}</p>
        <Link href="/people" className="mt-5 inline-block text-letterboxd-blue">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <section className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[180px_1fr]">
        <div className="grid aspect-square place-items-center rounded-md bg-gradient-to-br from-[#445566] to-[#14181c]">
          <UserRound className="h-20 w-20 text-white/35" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-letterboxd-blue">
            {kind === "actors" ? "Elenco" : "Direção"}
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">{data.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c4d1dc]">
            {data.description}
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="filmography-title">
        <h2
          id="filmography-title"
          className="mb-5 border-b border-white/10 pb-2 text-sm font-bold uppercase tracking-[0.18em] text-white"
        >
          Filmografia
        </h2>
        {data.movies?.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
            {data.movies.map((movie) => (
              <MoviePoster key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-letterboxd-label">
            Nenhum filme relacionado foi cadastrado.
          </p>
        )}
      </section>
    </div>
  );
}
