import fs from "fs";
import path from "path";
import type { Article, ArticleSummary } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const INDEX_PATH = path.join(CONTENT_DIR, "index.json");

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

function enhanceContent(html: string): string {
  // Convert "Dica de Ouro" paragraphs into premium callout blocks
  return html
    .replace(
      /<p>(?:🌟\s*)?A Dica de Ouro<\/p>\s*<p>([\s\S]*?)<\/p>/gi,
      (_m, body: string) =>
        `<aside class="callout callout--gold"><h3 class="callout__title">A Dica de Ouro</h3><p>${body}</p></aside>`
    )
    .replace(
      /<p>(?:🌟\s*)?A Dica de Ouro<\/p>/gi,
      `<aside class="callout callout--gold"><h3 class="callout__title">A Dica de Ouro</h3>`
    );
}

/** Extrai texto da Dica de Ouro para a lateral do artigo */
export function extractGoldTip(html: string, explicit?: string): string | null {
  if (explicit?.trim()) return explicit.trim();
  const fromCallout = html.match(
    /<aside class="callout callout--gold">[\s\S]*?<p>([\s\S]*?)<\/p>/i
  );
  if (fromCallout?.[1]) {
    return fromCallout[1].replace(/<[^>]+>/g, "").trim().slice(0, 280);
  }
  const fromParagraphs = html.match(
    /<p>(?:🌟\s*)?A Dica de Ouro<\/p>\s*<p>([\s\S]*?)<\/p>/i
  );
  if (fromParagraphs?.[1]) {
    return fromParagraphs[1].replace(/<[^>]+>/g, "").trim().slice(0, 280);
  }
  return null;
}

export function getArticleSummaries(): ArticleSummary[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const items = readJsonFile<ArticleSummary[]>(INDEX_PATH);
  return items
    .filter((a) => a.status === "published")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getAllArticleSummaries(): ArticleSummary[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  return readJsonFile<ArticleSummary[]>(INDEX_PATH).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const article = readJsonFile<Article>(filePath);
  return {
    ...article,
    content: enhanceContent(article.content),
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getFeaturedArticle(): ArticleSummary | null {
  const all = getArticleSummaries();
  return all.find((a) => a.featured) || all[0] || null;
}

export function getPopularArticles(limit = 6): ArticleSummary[] {
  return [...getArticleSummaries()]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getRecentArticles(limit = 9): ArticleSummary[] {
  return getArticleSummaries().slice(0, limit);
}

export function getArticlesByCategory(categorySlug: string): ArticleSummary[] {
  return getArticleSummaries().filter((a) => a.categorySlug === categorySlug);
}

export function getArticlesByTag(tag: string): ArticleSummary[] {
  const normalized = tag.toLowerCase();
  return getArticleSummaries().filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(normalized)
  );
}

export function getRelatedArticles(article: Article, limit = 4): ArticleSummary[] {
  const others = getArticleSummaries().filter((a) => a.slug !== article.slug);
  const scored = others.map((a) => {
    let score = 0;
    if (a.categorySlug === article.categorySlug) score += 5;
    score += a.tags.filter((t) => article.tags.includes(t)).length * 2;
    return { a, score };
  });
  return scored
    .sort((x, y) => y.score - x.score || y.a.views - x.a.views)
    .slice(0, limit)
    .map((x) => x.a);
}

export function getAdjacentArticles(slug: string): {
  prev: ArticleSummary | null;
  next: ArticleSummary | null;
} {
  const all = getArticleSummaries();
  const idx = all.findIndex((a) => a.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: all[idx + 1] || null,
    next: all[idx - 1] || null,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of getArticleSummaries()) {
    for (const tag of a.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const a of getArticleSummaries()) {
    const prev = map.get(a.categorySlug);
    map.set(a.categorySlug, {
      name: a.category,
      count: (prev?.count || 0) + 1,
    });
  }
  return [...map.entries()].map(([slug, v]) => ({
    slug,
    name: v.name,
    count: v.count,
  }));
}

export function searchArticles(query: string): ArticleSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return getArticleSummaries()
    .map((a) => {
      const hay = [
        a.title,
        a.subtitle,
        a.excerpt,
        a.category,
        a.tags.join(" "),
        a.author,
      ]
        .join(" ")
        .toLowerCase();

      // Also search full content when available
      const full = getArticleBySlug(a.slug);
      const contentHay = (full?.contentText || "").toLowerCase();
      const blob = `${hay} ${contentHay}`;

      let score = 0;
      for (const term of terms) {
        if (a.title.toLowerCase().includes(term)) score += 10;
        if (a.tags.some((t) => t.toLowerCase().includes(term))) score += 6;
        if (a.category.toLowerCase().includes(term)) score += 5;
        if (blob.includes(term)) score += 2;
      }
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** Returns a displayable author name, or null when empty/placeholder. */
export function resolveAuthor(author?: string): string | null {
  const a = (author || "").trim();
  if (!a) return null;
  if (/^\[.*\]$/.test(a)) return null;
  return a;
}
