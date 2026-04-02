"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-letterboxd-background text-white px-4 text-center">
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-letterboxd-label max-w-md">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <button
        onClick={reset}
        className="bg-letterboxd-green hover:bg-letterboxd-green-hover text-white px-4 py-2 rounded-md font-semibold"
      >
        Tentar novamente
      </button>
    </div>
  );
}
