"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MoviePoster } from "@/components/movie-poster/movie-poster";
import { Pagination } from "@/components/pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiResource } from "@/hooks/use-api-resource";
import { getPaginatedItems } from "@/lib/api";
import type { Movie, PaginatedResponse } from "@/types/api";

interface FilmCatalogProps {
  initialTitle?: string;
}

export function FilmCatalog({ initialTitle = "" }: FilmCatalogProps) {
  const [search, setSearch] = useState(initialTitle);
  const [title, setTitle] = useState(initialTitle);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("title:ASC");

  const path = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "12",
      include: "genres,directors",
      order,
    });
    if (title.trim()) params.set("title", title.trim());
    return `/movies?${params.toString()}`;
  }, [order, page, title]);

  const { data, error, isLoading } =
    useApiResource<PaginatedResponse<Movie>>(path);
  const movies = getPaginatedItems(data);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setTitle(search);
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 rounded-md bg-[#14181c] p-4 sm:flex-row">
        <form onSubmit={handleSearch} className="relative flex-1">
          <label htmlFor="film-search" className="sr-only">
            Buscar filmes por título
          </label>
          <input
            id="film-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por título..."
            className="h-10 w-full rounded-sm bg-letterboxd-input px-4 pr-11 text-sm font-medium text-[#26333d] outline-none transition focus:bg-white focus:ring-2 focus:ring-letterboxd-blue"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#52616d] hover:text-black"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-letterboxd-label" aria-hidden="true" />
          <label htmlFor="film-order" className="sr-only">
            Ordenar filmes
          </label>
          <select
            id="film-order"
            value={order}
            onChange={(event) => {
              setPage(1);
              setOrder(event.target.value);
            }}
            className="h-10 rounded-sm bg-[#2c3440] px-3 text-xs font-bold uppercase tracking-wider text-white outline-none focus:ring-2 focus:ring-letterboxd-blue"
          >
            <option value="title:ASC">Título A–Z</option>
            <option value="title:DESC">Título Z–A</option>
            <option value="releaseDate:DESC">Mais recentes</option>
            <option value="releaseDate:ASC">Mais antigos</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }, (_, index) => (
            <Skeleton key={index} className="aspect-[2/3] bg-white/10" />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-letterboxd-orange/30 bg-letterboxd-orange/10 p-8 text-center">
          <p className="font-bold text-white">Não foi possível carregar os filmes.</p>
          <p className="mt-1 text-sm text-letterboxd-label">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && movies.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/15 p-12 text-center">
          <p className="font-bold text-white">Nenhum filme encontrado.</p>
          <p className="mt-1 text-sm text-letterboxd-label">
            Tente buscar por outro título.
          </p>
        </div>
      ) : null}

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {movies.map((movie) => (
              <MoviePoster key={movie.id} movie={movie} />
            ))}
          </div>
          <Pagination
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </>
      ) : null}
    </>
  );
}
