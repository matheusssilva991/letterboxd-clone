import Link from "next/link";
import { StarRating } from "@/components/star-rating/star-rating";
import type { MovieReview } from "@/types/api";

interface ReviewCardProps {
  review: MovieReview;
  showMovie?: boolean;
  actions?: React.ReactNode;
}

export function ReviewCard({
  review,
  showMovie = false,
  actions,
}: ReviewCardProps) {
  const author = review.user?.username ?? "Membro";
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(review.createdAt));

  return (
    <article className="border-b border-white/10 py-5 first:pt-0 last:border-0">
      {showMovie && review.movie ? (
        <Link
          href={`/films/${review.movie.id}`}
          className="mb-2 block text-lg font-bold text-white hover:text-letterboxd-blue"
        >
          {review.movie.title}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href={review.user ? `/members/${review.user.id}` : "/members"}
          className="text-sm font-bold text-white hover:text-letterboxd-blue"
        >
          {author}
        </Link>
        <StarRating value={review.stars} />
        <time className="text-xs text-letterboxd-label" dateTime={review.createdAt}>
          {date}
        </time>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#c4d1dc]">{review.comment}</p>
      {actions ? <div className="mt-3">{actions}</div> : null}
    </article>
  );
}
