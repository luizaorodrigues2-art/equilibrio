"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove("site-cinema");
      return;
    }
    document.body.classList.add("site-cinema");
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      document.body.classList.remove("site-cinema");
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
