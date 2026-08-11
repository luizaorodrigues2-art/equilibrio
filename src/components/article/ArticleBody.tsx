import { AdSlot } from "@/components/ui/AdSlot";

function injectMidAd(html: string) {
  const parts = html.split("</p>");
  if (parts.length < 4) return html;
  const insertAt = 2;
  return parts
    .map((part, i) => {
      const chunk = `${part}${i < parts.length - 1 ? "</p>" : ""}`;
      if (i === insertAt) {
        return `${chunk}<div data-ad-inline="article-mid-1"></div>`;
      }
      return chunk;
    })
    .join("");
}

export function ArticleBody({ content }: { content: string }) {
  const html = injectMidAd(content);
  const [before, after] = html.split('<div data-ad-inline="article-mid-1"></div>');

  return (
    <div className="prose">
      <div dangerouslySetInnerHTML={{ __html: before }} />
      {after !== undefined && <AdSlot id="article-incontent-1" label="Anúncio — meio do artigo" />}
      {after !== undefined && <div dangerouslySetInnerHTML={{ __html: after }} />}
    </div>
  );
}
