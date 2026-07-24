import Link from "next/link";
import Image from "next/image";
import { Film } from "lucide-react";
import type { Movie } from "@/types/api";

interface MoviePosterProps {
  movie: Pick<Movie, "id" | "title" | "imagePath" | "releaseDate">;
}

const posterTones = [
  "from-[#52311e] via-[#172e38] to-[#14181c]",
  "from-[#1d4350] via-[#27394b] to-[#14181c]",
  "from-[#4b243b] via-[#243142] to-[#14181c]",
  "from-[#344b2e] via-[#23343c] to-[#14181c]",
] as const;

export function MoviePoster({ movie }: MoviePosterProps) {
  const tone = posterTones[movie.id % posterTones.length];
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <article className="group min-w-0">
      <Link
        href={`/films/${movie.id}`}
        className="block overflow-hidden rounded-md border border-white/10 bg-[#14181c] shadow-lg transition duration-200 hover:-translate-y-1 hover:border-letterboxd-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-letterboxd-green"
      >
        <div className={`relative aspect-[2/3] bg-gradient-to-br ${tone}`}>
          {movie.imagePath ? (
            <Image
              src={movie.imagePath}
              alt={`Pôster de ${movie.title}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.18),transparent_45%)]" />
              <div className="absolute inset-x-4 bottom-5 text-center">
                <Film className="mx-auto mb-3 h-8 w-8 text-white/50" aria-hidden="true" />
                <p className="line-clamp-3 text-sm font-black uppercase tracking-wider text-white">
                  {movie.title}
                </p>
              </div>
            </>
          )}
        </div>
      </Link>
      <h2 className="mt-2 truncate text-sm font-bold text-white">{movie.title}</h2>
      {year ? <p className="text-xs text-letterboxd-label">{year}</p> : null}
    </article>
  );
}
