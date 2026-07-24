import type { Metadata } from "next";
import { FilmCatalog } from "@/components/film-catalog/film-catalog";
import { PageShell } from "@/components/page-shell/page-shell";

export const metadata: Metadata = {
  title: "Filmes",
  description: "Explore todos os filmes disponíveis no catálogo.",
};

interface FilmsPageProps {
  searchParams: Promise<{ title?: string }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const { title = "" } = await searchParams;

  return (
    <PageShell
      eyebrow="Catálogo"
      title="Filmes"
      description="Explore o catálogo, encontre novos favoritos e veja quem está por trás de cada produção."
    >
      <FilmCatalog initialTitle={title} />
    </PageShell>
  );
}
