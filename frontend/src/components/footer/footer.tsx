import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#14181c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-xs text-letterboxd-label sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Um espaço para guardar e compartilhar sua história com o cinema.</p>
        <nav className="flex gap-5" aria-label="Rodapé">
          <Link href="/films" className="hover:text-white">
            Filmes
          </Link>
          <Link href="/people" className="hover:text-white">
            Elenco
          </Link>
          <Link href="/members" className="hover:text-white">
            Membros
          </Link>
        </nav>
      </div>
    </footer>
  );
}
