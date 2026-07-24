import type { Metadata } from "next";
import { MyReviews } from "@/components/my-reviews/my-reviews";
import { PageShell } from "@/components/page-shell/page-shell";

export const metadata: Metadata = {
  title: "Minhas avaliações",
};

export default function ReviewsPage() {
  return (
    <PageShell
      eyebrow="Seu histórico"
      title="Minhas avaliações"
      description="Relembre as notas e comentários que você publicou."
    >
      <MyReviews />
    </PageShell>
  );
}
