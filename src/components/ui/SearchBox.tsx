"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/components/providers/AnalyticsProvider";

type Result = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
};

export function SearchBox({
  autoFocus = false,
  onClose,
}: {
  autoFocus?: boolean;
  onClose?: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
        trackEvent("search", { query: q, results: data.results?.length || 0 });
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por título, categoria, tags ou conteúdo..."
        aria-label="Buscar artigos"
        style={{
          width: "100%",
          borderRadius: 999,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          color: "var(--text)",
          padding: "0.9rem 1.2rem",
          font: "inherit",
        }}
      />
      {(loading || results.length > 0 || q.trim()) && (
        <div className="search-panel" style={{ marginTop: "0.6rem" }}>
          {loading && <div style={{ padding: "1rem" }}>Buscando...</div>}
          {!loading && results.length === 0 && q.trim() && (
            <div style={{ padding: "1rem", color: "var(--text-muted)" }}>
              Nenhum resultado para “{q}”.
            </div>
          )}
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/artigos/${r.slug}`}
              onClick={onClose}
              data-track="article_open"
              data-track-slug={r.slug}
            >
              <strong>{r.title}</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {r.category} — {r.excerpt.slice(0, 110)}…
              </div>
            </Link>
          ))}
          {q.trim() && (
            <Link href={`/busca?q=${encodeURIComponent(q)}`} onClick={onClose}>
              Ver todos os resultados
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
