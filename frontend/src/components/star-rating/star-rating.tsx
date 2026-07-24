import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  label?: string;
  size?: "sm" | "md";
}

export function StarRating({ value, label, size = "sm" }: StarRatingProps) {
  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={label ?? `${value} de 5 estrelas`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            starSize,
            index < value
              ? "fill-letterboxd-green text-letterboxd-green"
              : "fill-white/10 text-white/15",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
