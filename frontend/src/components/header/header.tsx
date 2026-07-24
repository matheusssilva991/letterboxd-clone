"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { NavLink } from "@/components/navlink/navlink";
import { SearchBar } from "@/components/search-bar/search-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth-hook";

const publicLinks = [
  { href: "/films", label: "Filmes" },
  { href: "/people", label: "Elenco" },
  { href: "/members", label: "Membros" },
] as const;

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = search.trim();
    router.push(title ? `/films?title=${encodeURIComponent(title)}` : "/films");
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-letterboxd-header-bg/95 py-3 backdrop-blur md:py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 sm:px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-letterboxd-blue"
          aria-label="Letterboxd — início"
        >
          <span className="flex items-center" aria-hidden="true">
            <span className="h-4 w-4 rounded-full border-2 border-white bg-letterboxd-orange sm:h-5 sm:w-5" />
            <span className="-ml-1 h-4 w-4 rounded-full border-2 border-white bg-letterboxd-green sm:h-5 sm:w-5" />
            <span className="-ml-1 h-4 w-4 rounded-full border-2 border-white bg-letterboxd-blue sm:h-5 sm:w-5" />
          </span>
          <span className="text-xl font-bold tracking-wide text-white transition-colors group-hover:text-gray-200 sm:text-2xl md:text-3xl">
            Letterboxd
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          <nav className="hidden items-center gap-4 md:flex" aria-label="Principal">
            {!isAuthenticated ? (
              <AuthModal>
                <button
                  type="button"
                  className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-letterboxd-label transition-colors hover:text-white"
                >
                  Entrar / Criar conta
                </button>
              </AuthModal>
            ) : (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded px-2 py-1 text-letterboxd-label transition hover:text-white"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-transparent text-current">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-28 truncate text-xs font-bold uppercase tracking-widest">
                      {user?.username ?? "Perfil"}
                    </span>
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Meu perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews">Minhas avaliações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void logout()}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {publicLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submitSearch}>
            <label htmlFor="header-search" className="sr-only">
              Buscar filmes
            </label>
            <SearchBar
              id="header-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar filmes..."
            />
          </form>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 text-letterboxd-label transition-colors hover:text-white md:hidden"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav
          id="mobile-navigation"
          className="mt-3 border-t border-white/10 bg-letterboxd-modal px-4 py-3 md:hidden"
          aria-label="Menu móvel"
        >
          <form onSubmit={submitSearch} className="mb-2 sm:hidden">
            <SearchBar
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar filmes..."
              wrapperClassName="relative block"
              inputClassName="h-10 w-full rounded-full bg-letterboxd-input px-4 pr-10 text-sm text-[#26333d] outline-none focus:bg-white"
            />
          </form>
          {!isAuthenticated ? (
            <AuthModal>
              <button
                type="button"
                className="block w-full px-2 py-3 text-left text-sm font-bold uppercase tracking-wide text-white"
              >
                Entrar / Criar conta
              </button>
            </AuthModal>
          ) : (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                Meu perfil
              </Link>
              <Link
                href="/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                Minhas avaliações
              </Link>
            </>
          )}
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                void logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full border-t border-white/10 px-2 py-3 text-left text-sm font-bold uppercase tracking-wide text-letterboxd-label"
            >
              Sair
            </button>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
