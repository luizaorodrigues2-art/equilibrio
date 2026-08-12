"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SearchBox } from "@/components/ui/SearchBox";
import { BrandLogo } from "@/components/ui/BrandLogo";

const links = [
  { href: "/", label: "Início" },
  { href: "/artigos", label: "Artigos" },
  { href: "/categoria/saude-do-corpo", label: "Corpo" },
  { href: "/categoria/saude-da-mente", label: "Mente" },
  { href: "/categoria/saude-espiritual", label: "Espírito" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container site-header__inner">
        <BrandLogo size="sm" />

        <nav className={`nav ${open ? "open" : ""}`} aria-label="Menu principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              data-track="category_click"
              data-track-label={link.label}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            aria-label="Buscar"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button
            className="icon-btn icon-btn--theme"
            aria-label="Alternar tema"
            onClick={toggleTheme}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button
            className="icon-btn burger"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="container" style={{ paddingBottom: "1rem" }}>
          <SearchBox autoFocus onClose={() => setSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
