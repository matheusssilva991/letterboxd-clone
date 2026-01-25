import Link from "next/link";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xs font-bold uppercase tracking-widest text-letterboxd-label hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}