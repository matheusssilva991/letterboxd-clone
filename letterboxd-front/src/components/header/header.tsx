"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar/search-bar";
import { NavLink } from "../navlink/navlink";
import { useAuth } from "@/hooks/auth-hook";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="w-full bg-letterboxd-header-bg py-3 md:py-4 border-b border-white/5 select-none">
      <div className="w-full lg:w-3/4 xl:w-3/5 mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          {/* Círculos maiores, conectados e com borda branca */}
          <div className="flex items-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-letterboxd-orange border-2 border-white"></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-letterboxd-green border-2 border-white -ml-1"></div>
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-letterboxd-blue border-2 border-white -ml-1"></div>
          </div>
          <span className="font-bold text-xl sm:text-2xl md:text-3xl tracking-wide text-white group-hover:text-gray-200 transition-colors">
            Letterboxd
          </span>
        </Link>

        {/* --- NAVEGAÇÃO E BUSCA --- */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Botão Menu Hambúrguer (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-letterboxd-label hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Links de Navegação (Desktop) */}
          <nav className="hidden md:flex items-center gap-3 sm:gap-4 md:gap-5">
            {!isAuthenticated ? (
              <AuthModal>
                <button
                  type="button"
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-letterboxd-label hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Sign In / Sign Up</span>
                  <span className="sm:hidden">Sign In</span>
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
            <NavLink href="/lists" className="hidden sm:inline-block">Lists</NavLink>
            <NavLink href="/members" className="hidden md:inline-block">Members</NavLink>
            <NavLink href="/journal" className="hidden md:inline-block">Journal</NavLink>
          </nav>
          {/* --- BARRA DE BUSCA --- */}
          <SearchBar placeholder="Search..." />
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-letterboxd-modal border-t border-white/10">
          <nav className="flex flex-col py-2">
            {!isAuthenticated ? (
              <AuthModal>
                <button
                  type="button"
                  className="text-left px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In / Sign Up
                </button>
              </AuthModal>
            ) : (
              <>
                <Link href="/profile" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  {user?.username ?? "Profile"}
                </Link>
                <div className="border-t border-white/10 my-1"></div>
              </>
            )}
            <Link href="/films" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Films
            </Link>
            <Link href="/lists" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Lists
            </Link>
            <Link href="/members" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Members
            </Link>
            <Link href="/journal" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Journal
            </Link>
            {isAuthenticated && (
              <>
                <div className="border-t border-white/10 my-1"></div>
                <Link href="/diary" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Diary
                </Link>
                <Link href="/reviews" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Reviews
                </Link>
                <Link href="/watchlist" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Watchlist
                </Link>
                <Link href="/settings" className="px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-6 py-3 text-sm font-bold uppercase tracking-wide text-letterboxd-label hover:text-white hover:bg-white/5 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
