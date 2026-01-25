import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar/search-bar";
import { NavLink } from "../navlink/navlink";

export function Header() {
  return (
    <header className="w-full bg-letterboxd-header-bg py-4 border-b border-white/5 select-none">
      <div className="w-1/2 mx-auto px-4 flex items-center justify-between">

        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Círculos maiores, conectados e com borda branca */}
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-letterboxd-orange border-2 border-white"></div>
            <div className="w-5 h-5 rounded-full bg-letterboxd-green border-2 border-white -ml-1"></div>
            <div className="w-5 h-5 rounded-full bg-letterboxd-blue border-2 border-white -ml-1"></div>
          </div>
          <span className="font-bold text-3xl tracking-wide text-white group-hover:text-gray-200 transition-colors">
            Letterboxd
          </span>
        </Link>

        {/* --- NAVEGAÇÃO E BUSCA --- */}
        <div className="flex items-center gap-6">

          {/* Links de Navegação (Desktop) */}
          <nav className="hidden md:flex items-center gap-5">
            <AuthModal>
              <NavLink href="#">
                Sign In / Sign Up
              </NavLink>
            </AuthModal>
            <NavLink href="/films">Films</NavLink>
            <NavLink href="/lists">Lists</NavLink>
            <NavLink href="/members">Members</NavLink>
            <NavLink href="/journal">Journal</NavLink>
          </nav>

          {/* --- BARRA DE BUSCA --- */}
          <SearchBar placeholder="Search..." />

        </div>
      </div>
    </header>
  );
}
