import { NextRequest, NextResponse } from "next/server";
import { analyzeCoverBrief, renderCoverSvg } from "@/lib/cover-ai";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "artigo";
  const title = req.nextUrl.searchParams.get("title") || "SAÚDE INTEGRAL";
  const cat = req.nextUrl.searchParams.get("cat") || "saude-da-mente";
  const category =
    cat === "saude-do-corpo"
      ? "Saúde do Corpo"
      : cat === "saude-espiritual"
        ? "Saúde Espiritual"
        : "Saúde da Mente";

  const brief = analyzeCoverBrief({
    slug,
    title,
    category,
    categorySlug: cat,
    tags: [cat],
  });

  const svg = renderCoverSvg(brief, title, category, {
    width: 960,
    height: 540,
    showTitle: false,
    showLabels: false,
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Disposition": "inline",
    },
  });
}
