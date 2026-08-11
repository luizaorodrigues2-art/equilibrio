import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { AdSlot } from "@/components/ui/AdSlot";

type ArticleSidebarProps = {
  tags: string[];
  category: string;
  categorySlug: string;
  goldTip?: string | null;
};

export function ArticleSidebar({ tags, category, categorySlug, goldTip }: ArticleSidebarProps) {
  return (
    <aside className="article-sidebar" style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
      <div className="article-sidebar__card">
        <h2 className="article-sidebar__title">Nesta leitura</h2>
        <p className="article-sidebar__text">
          Categoria:{" "}
          <Link href={`/categoria/${categorySlug}`} className="article-sidebar__link">
            {category}
          </Link>
        </p>
        <p className="article-sidebar__pillars">
          {siteConfig.pillars.map((p, i) => (
            <span key={p}>
              {i > 0 && " · "}
              <span data-pillar={p.toLowerCase()}>{p}</span>
            </span>
          ))}
        </p>
      </div>

      {goldTip && (
        <div className="article-sidebar__card article-sidebar__card--gold">
          <h2 className="article-sidebar__title">A Dica de Ouro</h2>
          <p className="article-sidebar__text">{goldTip}</p>
        </div>
      )}

      <AdSlot id="article-sidebar" label="Anúncio — lateral" minHeight={250} />

      <div className="article-sidebar__card">
        <h2 className="article-sidebar__title">Tags</h2>
        <div className="tag-cloud">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="tag"
              data-track="tag_click"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="article-sidebar__card article-sidebar__author">
        <div className="article-sidebar__photo" aria-hidden="true">
          {/* Espaço reservado — substituir por foto oficial em /assets/brand/author-photo.jpg */}
          <span>Foto</span>
        </div>
        <div>
          <strong>{siteConfig.author}</strong>
          <p className="article-sidebar__role">{siteConfig.authorRole}</p>
          <Link href="/sobre#autor" className="article-sidebar__link">
            Sobre o autor →
          </Link>
        </div>
      </div>
    </aside>
  );
}
