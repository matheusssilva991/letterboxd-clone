import { AuthModal } from "@/components/auth/auth-modal";
import { MovieShelf } from "@/components/movie-shelf/movie-shelf";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Search, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="-mt-6 pb-16">
      <section className="relative min-h-[520px] overflow-hidden border-b border-white/5 bg-[#14181c]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(64,188,244,0.22),transparent_28%),radial-gradient(circle_at_25%_12%,rgba(255,128,0,0.16),transparent_24%),linear-gradient(to_bottom,transparent,#1d242b)]" />
        <div className="absolute inset-x-0 top-0 mx-auto grid max-w-6xl grid-cols-3 gap-3 px-4 opacity-25 sm:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="aspect-[2/3] rotate-3 rounded-md border border-white/10 bg-gradient-to-br from-white/20 to-transparent shadow-2xl even:-rotate-3 even:translate-y-10"
            />
          ))}
        </div>
        <div className="relative mx-auto flex min-h-[520px] max-w-4xl flex-col items-center justify-end px-4 pb-16 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-letterboxd-blue">
            Sua vida em filmes
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
            Acompanhe o que você assiste. Descubra seu próximo filme.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#c4d1dc] sm:text-lg">
            Registre avaliações, explore o catálogo e compartilhe suas opiniões
            com uma comunidade apaixonada por cinema.
          </p>
          <AuthModal>
            <Button className="mt-8 h-11 bg-letterboxd-header-btn px-7 font-bold uppercase tracking-widest text-white hover:bg-letterboxd-header-btn-hover">
              Comece agora — é grátis
            </Button>
          </AuthModal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pt-12 sm:px-6">
        <section className="grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-4">
          {[
            { icon: Eye, text: "Acompanhe os filmes que assistiu" },
            { icon: Star, text: "Avalie de uma a cinco estrelas" },
            { icon: MessageCircle, text: "Escreva e leia opiniões" },
            { icon: Search, text: "Descubra elenco e diretores" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-[#14181c] p-5">
              <Icon className="h-5 w-5 text-letterboxd-green" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#c4d1dc]">{text}</p>
            </div>
          ))}
        </section>

        <MovieShelf title="Filmes recentes no catálogo" />
      </div>
    </div>
  );
}
