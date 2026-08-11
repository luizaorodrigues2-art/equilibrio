import Link from "next/link";
import type { ArticleSummary } from "@/lib/types";

export function ArticleNav({
  prev,
  next,
}: {
  prev: ArticleSummary | null;
  next: ArticleSummary | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="article-nav" aria-label="Navegação entre artigos">
      {prev ? (
        <Link href={`/artigos/${prev.slug}`}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Artigo anterior</div>
          <strong>{prev.title}</strong>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/artigos/${next.slug}`} style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Próximo artigo</div>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
