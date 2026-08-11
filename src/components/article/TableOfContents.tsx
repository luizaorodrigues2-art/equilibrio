import type { TocItem } from "@/lib/types";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items?.length) return null;
  return (
    <nav className="toc" aria-label="Índice do artigo">
      <h2>Neste artigo</h2>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
