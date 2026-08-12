/**
 * Regenera capas exclusivas (WebP) para todos os artigos.
 * Uso: npx tsx scripts/generate-covers.ts
 */
import fs from "fs";
import path from "path";
import { generateCoverPackage } from "../src/lib/cover-ai";
import type { Article } from "../src/lib/types";

const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const INDEX_PATH = path.join(ROOT, "content", "index.json");

/** Carrega variáveis de .env.local / .env (ex.: PEXELS_API_KEY) para o script. */
(function loadEnvLocal() {
  for (const file of [".env.local", ".env"]) {
    try {
      const txt = fs.readFileSync(path.join(ROOT, file), "utf-8");
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m && !process.env[m[1]]) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
        }
      }
    } catch {
      /* arquivo ausente — segue */
    }
  }
})();

async function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const hasKey = Boolean((process.env.PEXELS_API_KEY || "").trim());
  console.log(
    hasKey
      ? `Gerando capas com FOTOGRAFIA REAL (Pexels) para ${files.length} artigos...`
      : `⚠ PEXELS_API_KEY não encontrada — usando arte de fallback. Configure a chave em .env.local para fotos reais. (${files.length} artigos)`
  );

  const summaries = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const article = JSON.parse(
      fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "")
    ) as Article;

    process.stdout.write(`→ ${article.slug} ... `);
    const pack = await generateCoverPackage(
      {
        slug: article.slug,
        title: article.title,
        subtitle: article.subtitle,
        excerpt: article.excerpt,
        contentText: article.contentText || article.content.replace(/<[^>]+>/g, " "),
        category: article.category,
        categorySlug: article.categorySlug,
        tags: article.tags,
      },
      { publicDir: path.join(ROOT, "public") }
    );

    const updated: Article = {
      ...article,
      coverImage: pack.coverImage,
      coverAlt: pack.coverAlt,
      coverCaption: pack.coverCaption,
      coverDescription: pack.coverDescription,
      coverVariants: pack.coverVariants,
      coverMeta: pack.coverMeta,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

    const { content: _c, contentText: _t, toc: _toc, faq: _faq, sourceFile: _s, ...summary } =
      updated;
    summaries.push(summary);
    console.log(`${pack.coverMeta.style} / ${pack.coverMeta.layout}`);
  }

  summaries.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  fs.writeFileSync(INDEX_PATH, JSON.stringify(summaries, null, 2), "utf-8");
  console.log("\nCapa única gerada para todos os artigos. Index atualizado.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
