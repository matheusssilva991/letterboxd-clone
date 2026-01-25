import Link from "next/link";

export function NavLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`text-xs font-bold uppercase tracking-widest text-letterboxd-label hover:text-white transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}