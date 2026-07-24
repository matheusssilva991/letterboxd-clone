import type { Metadata } from "next";
import { MovieDetail } from "@/components/movie-detail/movie-detail";

export const metadata: Metadata = {
  title: "Detalhes do filme",
};

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  return <MovieDetail movieId={id} />;
}
