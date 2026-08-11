import Link from "next/link";

export function TagCloud({ tags }: { tags: { tag: string; count: number }[] }) {
  return (
    <div className="tag-cloud">
      {tags.map((t) => (
        <Link
          key={t.tag}
          href={`/tag/${encodeURIComponent(t.tag)}`}
          className="tag"
          data-track="tag_click"
          data-track-label={t.tag}
        >
          #{t.tag} · {t.count}
        </Link>
      ))}
    </div>
  );
}
