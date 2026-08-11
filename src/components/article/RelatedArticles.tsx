import { ArticleCard } from "@/components/ui/ArticleCard";
import type { ArticleSummary } from "@/lib/types";

export function RelatedArticles({ articles }: { articles: ArticleSummary[] }) {
  if (!articles.length) return null;
  return (
    <section className="section" style={{ paddingTop: "1rem" }}>
      <div className="section__head">
        <div>
          <div className="section__eyebrow">Continue explorando</div>
          <h2 className="section__title">Artigos relacionados</h2>
        </div>
      </div>
      <div className="grid-articles">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
