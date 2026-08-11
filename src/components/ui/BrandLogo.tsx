import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { w: 148, h: 52 },
  md: { w: 200, h: 70 },
  lg: { w: 280, h: 98 },
};

export function BrandLogo({ href = "/", size = "md", className = "" }: BrandLogoProps) {
  const dim = sizes[size];
  const content = (
    <span className={`brand-logo ${className}`.trim()}>
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={dim.w}
        height={dim.h}
        className="brand-logo__mark"
        priority={size !== "lg"}
        style={{ width: dim.w, height: "auto", maxHeight: dim.h, objectFit: "contain" }}
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="logo brand-logo-link" aria-label={`${siteConfig.name} — Início`}>
      {content}
    </Link>
  );
}
