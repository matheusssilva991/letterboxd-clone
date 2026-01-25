"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar/search-bar";
import { NavLink } from "../navlink/navlink";
import { useAuth } from "@/hooks/auth-hook";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={`outline-none flex items-center gap-2 px-2 py-1 rounded transition-all group ${
                    dropdownOpen ? 'text-white' : 'text-[#99AABB] hover:text-white'
                  }`}>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-transparent text-current">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {user?.username ?? "USER"}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={0} className="w-48 border-none p-0">
                  <div className="py-1">
                    <DropdownMenuItem asChild><Link href="/">Home</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/films">Films</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/diary">Diary</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reviews">Reviews</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/watchlist">Watchlist</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/lists">Lists</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/likes">Likes</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/tags">Tags</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/network">Network</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/subscriptions">Subscriptions</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                  </div>
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
