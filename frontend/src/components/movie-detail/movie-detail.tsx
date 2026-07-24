"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Clock3, Film, Send } from "lucide-react";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { ReviewCard } from "@/components/review-card/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/use-api-resource";
import { useAuth } from "@/hooks/auth-hook";
import { getPaginatedItems } from "@/lib/api";
import { apiFetch } from "@/services/api-client";
import type { Movie, MovieReview, PaginatedResponse } from "@/types/api";

interface MovieDetailProps {
  movieId: string;
}

export function MovieDetail({ movieId }: MovieDetailProps) {
  const { isAuthenticated } = useAuth();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsVersion, setReviewsVersion] = useState(0);
  const moviePath = `/movies/${movieId}?include=actors,directors,genres`;
  const reviewsPath = `/movies/${movieId}/reviews?page=1&limit=20`;
  const movie = useApiResource<Movie>(moviePath);
  const reviews = useApiResource<PaginatedResponse<MovieReview>>(
    reviewsPath,
    reviewsVersion,
  );
  const reviewItems = getPaginatedItems(reviews.data);

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stars) {
      toast.error("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Escreva um comentário sobre o filme.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<MovieReview>(`/movies/${movieId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ stars, comment: comment.trim() }),
      });
      setStars(0);
      setComment("");
      setReviewsVersion((version) => version + 1);
      toast.success("Avaliação publicada.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível avaliar o filme.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (movie.isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 md:grid-cols-[240px_1fr]">
        <Skeleton className="aspect-[2/3] bg-white/10" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4 bg-white/10" />
          <Skeleton className="h-5 w-1/3 bg-white/10" />
          <Skeleton className="h-32 w-full bg-white/10" />
        </div>
      </div>
    );
  }

  if (movie.error || !movie.data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
        <Film className="mx-auto h-10 w-10 text-letterboxd-orange" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-white">Filme não encontrado</h1>
        <p className="mt-2 text-letterboxd-label">
          {movie.error ?? "Este filme não está disponível."}
        </p>
        <Button asChild className="mt-6 bg-letterboxd-green text-white hover:bg-letterboxd-green-hover">
          <Link href="/films">Voltar ao catálogo</Link>
        </Button>
      </div>
    );
  }

  const releaseYear = new Date(movie.data.releaseDate).getFullYear();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr_250px]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-white/10 bg-gradient-to-br from-[#3a5260] via-[#24313b] to-[#14181c] shadow-2xl">
          {movie.data.imagePath ? (
            <Image
              src={movie.data.imagePath}
              alt={`Pôster de ${movie.data.title}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 260px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-end bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.15),transparent_45%)] p-8 text-center">
              <Film className="mb-4 h-12 w-12 text-white/40" aria-hidden="true" />
              <p className="text-lg font-black uppercase tracking-wider text-white">
                {movie.data.title}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-4xl font-black tracking-tight text-white">
              {movie.data.title}
            </h1>
            <span className="text-xl font-light text-letterboxd-label">
              {releaseYear}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-letterboxd-label">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {movie.data.duration} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {new Intl.DateTimeFormat("pt-BR").format(new Date(movie.data.releaseDate))}
            </span>
          </div>

          <p className="mt-7 text-base leading-7 text-[#c4d1dc]">
            {movie.data.synopsis}
          </p>

          {movie.data.genres?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {movie.data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#c4d1dc]"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          ) : null}

          {movie.data.directors?.length ? (
            <div className="mt-7 border-t border-white/10 pt-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-letterboxd-label">
                Direção
              </h2>
              <p className="mt-2 text-sm text-white">
                {movie.data.directors.map((director, index) => (
                  <span key={director.id}>
                    {index > 0 ? ", " : ""}
                    <Link
                      href={`/people/directors/${director.id}`}
                      className="hover:text-letterboxd-blue"
                    >
                      {director.name}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          ) : null}

          {movie.data.actors?.length ? (
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-letterboxd-label">
                Elenco
              </h2>
              <p className="mt-2 text-sm leading-6 text-white">
                {movie.data.actors.map((actor, index) => (
                  <span key={actor.id}>
                    {index > 0 ? ", " : ""}
                    <Link
                      href={`/people/actors/${actor.id}`}
                      className="hover:text-letterboxd-blue"
                    >
                      {actor.name}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-md bg-[#14181c] p-5 md:col-start-2 lg:col-start-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-letterboxd-label">
            Sua opinião
          </h2>
          {isAuthenticated ? (
            <form onSubmit={submitReview} className="mt-4">
              <fieldset>
                <legend className="sr-only">Nota do filme</legend>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStars(value)}
                        className={`text-2xl transition ${
                          value <= stars
                            ? "text-letterboxd-green"
                            : "text-white/20 hover:text-letterboxd-green/60"
                        }`}
                        aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label htmlFor="review-comment" className="sr-only">
                Comentário
              </label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={255}
                placeholder="O que você achou?"
                className="mt-4 min-h-28 border-white/10 bg-white/5 text-white placeholder:text-letterboxd-label"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full bg-letterboxd-green font-bold uppercase tracking-wider text-white hover:bg-letterboxd-green-hover"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {isSubmitting ? "Publicando..." : "Publicar"}
              </Button>
            </form>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-letterboxd-label">
                Entre na sua conta para avaliar este filme.
              </p>
              <AuthModal>
                <Button className="mt-4 w-full bg-letterboxd-green font-bold uppercase tracking-wider text-white hover:bg-letterboxd-green-hover">
                  Entrar para avaliar
                </Button>
              </AuthModal>
            </>
          )}
        </aside>
      </div>

      <section className="mt-14 max-w-3xl md:ml-[272px] lg:ml-[292px]" aria-labelledby="reviews-title">
        <div className="mb-5 border-b border-white/10 pb-2">
          <h2 id="reviews-title" className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Avaliações da comunidade
          </h2>
        </div>
        {reviews.isLoading ? <Skeleton className="h-32 bg-white/10" /> : null}
        {reviews.error ? (
          <p className="text-sm text-letterboxd-orange">{reviews.error}</p>
        ) : null}
        {!reviews.isLoading && !reviews.error && reviewItems.length === 0 ? (
          <p className="py-8 text-sm text-letterboxd-label">
            Ainda não há avaliações. Seja a primeira pessoa a opinar.
          </p>
        ) : null}
        {reviewItems.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </section>
    </div>
  );
}
