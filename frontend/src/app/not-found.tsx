import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-letterboxd-background text-white px-4 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-letterboxd-label">
        A página que você procurou não foi encontrada.
      </p>
      <Link
        href="/"
        className="bg-letterboxd-green hover:bg-letterboxd-green-hover text-white px-4 py-2 rounded-md font-semibold"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
