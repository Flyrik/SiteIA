"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Leaf, History, Search, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/medicament", label: "Médicaments", icon: Pill },
  { href: "/plante", label: "Plantes", icon: Leaf },
  { href: "/historique", label: "Historique", icon: History },
  { href: "/recherche", label: "Recherche", icon: Search },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--plant)] to-[var(--med)] flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
            SD
          </div>
          <span className="font-bold text-[var(--ink)] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            SnapDiag
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === href
                  ? "text-[var(--plant)] active"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="bg-[var(--plant)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--plant-dark)] transition-colors shadow-sm"
          >
            Analyser une photo
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-6 py-4 flex flex-col gap-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2 ${
                pathname === href ? "text-[var(--plant)]" : "text-[var(--muted)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mt-2 bg-[var(--plant)] text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
          >
            Analyser une photo
          </Link>
        </div>
      )}
    </header>
  );
}
