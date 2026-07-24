"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/auth-modal";
import { Pagination } from "@/components/pagination/pagination";
import { ReviewCard } from "@/components/review-card/review-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth-hook";
import { useApiResource } from "@/hooks/use-api-resource";
import { getPaginatedItems } from "@/lib/api";
import { apiFetch } from "@/services/api-client";
import type { MovieReview, PaginatedResponse } from "@/types/api";
import { useState } from "react";

export function MyReviews() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const reviews = useApiResource<PaginatedResponse<MovieReview>>(
    isAuthenticated
      ? `/reviews/my-reviews?page=${page}&limit=10`
      : null,
    reloadKey,
  );
  const reviewItems = getPaginatedItems(reviews.data);

  async function deleteReview(reviewId: number) {
    if (!window.confirm("Tem certeza que deseja remover esta avaliação?")) return;

    try {
      await apiFetch(`/reviews/${reviewId}`, { method: "DELETE" });
      setReloadKey((version) => version + 1);
      toast.success("Avaliação removida.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a avaliação.",
      );
    }
  }

  if (isAuthLoading) return <Skeleton className="h-60 bg-white/10" />;

  if (!isAuthenticated) {
    return (
      <div className="rounded-md border border-white/10 bg-[#14181c] p-10 text-center">
        <h2 className="text-xl font-bold text-white">Suas avaliações estão aqui</h2>
        <p className="mt-2 text-sm text-letterboxd-label">
          Entre para consultar e gerenciar tudo o que você já avaliou.
        </p>
        <AuthModal>
          <Button className="mt-6 bg-letterboxd-green font-bold uppercase tracking-wider text-white hover:bg-letterboxd-green-hover">
            Entrar
          </Button>
        </AuthModal>
      </div>
    );
  }

  if (reviews.isLoading) return <Skeleton className="h-60 bg-white/10" />;

  if (reviews.error) {
    return (
      <p className="rounded-md border border-letterboxd-orange/30 bg-letterboxd-orange/10 p-6 text-white">
        {reviews.error}
      </p>
    );
  }

  if (reviewItems.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-white/15 p-10 text-center text-letterboxd-label">
        Você ainda não avaliou nenhum filme.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-md bg-[#14181c] p-6">
        {reviewItems.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            showMovie
            actions={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => deleteReview(review.id)}
                className="h-8 px-2 text-xs text-letterboxd-label hover:bg-letterboxd-orange/10 hover:text-letterboxd-orange"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remover
              </Button>
            }
          />
        ))}
      </div>
      <Pagination
        page={reviews.data?.page ?? 1}
        totalPages={reviews.data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </>
  );
}
