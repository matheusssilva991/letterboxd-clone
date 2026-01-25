"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar/search-bar";
import { NavLink } from "../navlink/navlink";
import { useAuth } from "@/hooks/auth-hook";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
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
            {!isAuthenticated ? (
              <AuthModal>
                <button
                  type="button"
                  className="text-xs font-bold uppercase tracking-widest text-letterboxd-label hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
                >
                  Sign In / Sign Up
                </button>
              </AuthModal>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar>
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user?.username ?? "User"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
