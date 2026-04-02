"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive ? "text-letterboxd-green" : "text-letterboxd-label hover:text-white"} ${className}`}
    >
      {children}
    </Link>
  );
}
