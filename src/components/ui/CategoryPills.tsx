import Link from "next/link";

export function CategoryPills({
  categories,
  active,
}: {
  categories: { name: string; slug: string; count: number }[];
  active?: string;
}) {
  return (
    <div className="category-pills">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/categoria/${c.slug}`}
          className={`category-pill ${active === c.slug ? "is-active" : ""}`}
          data-track="category_click"
          data-track-label={c.name}
        >
          {c.name} ({c.count})
        </Link>
      ))}
    </div>
  );
}
