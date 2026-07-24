"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { MoviePoster } from "@/components/movie-poster/movie-poster";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { getPaginatedItems } from "@/lib/api";
import type { Movie, PaginatedResponse } from "@/types/api";

interface MovieShelfProps {
  title: string;
  query?: string;
}

export function MovieShelf({ title, query = "order=id:DESC" }: MovieShelfProps) {
  const { data, error, isLoading } = useApiResource<PaginatedResponse<Movie>>(
    `/movies?limit=6&include=genres&${query}`,
  );
  const movies = getPaginatedItems(data);

  return (
    <section aria-labelledby="movie-shelf-title">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <h2
          id="movie-shelf-title"
          className="text-sm font-bold uppercase tracking-[0.18em] text-white"
        >
          {title}
        </h2>
        <Link
          href="/films"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-letterboxd-label hover:text-letterboxd-blue"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[2/3] rounded-md bg-white/10" />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-letterboxd-orange/30 bg-letterboxd-orange/10 p-4 text-sm text-white">
          <AlertCircle className="h-4 w-4 text-letterboxd-orange" aria-hidden="true" />
          O catálogo está indisponível no momento.
        </div>
      ) : null}

      {!isLoading && !error && movies.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/15 p-8 text-center text-sm text-letterboxd-label">
          Nenhum filme foi cadastrado ainda.
        </p>
      ) : null}

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {movies.map((movie) => (
            <MoviePoster key={movie.id} movie={movie} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
