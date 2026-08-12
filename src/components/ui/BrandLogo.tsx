import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Emblema transparente (fundo removido) — integra ao header/footer escuros. */
const LOGO_MARK = "/assets/brand/logo-mark.png";

const sizes = {
  sm: 44,
  md: 84,
  lg: 120,
};

export function BrandLogo({ href = "/", size = "md", className = "" }: BrandLogoProps) {
  const dim = sizes[size];
  const content = (
    <span className={`brand-logo brand-logo--stack brand-logo--${size} ${className}`.trim()}>
      <Image
        src={LOGO_MARK}
        alt={siteConfig.name}
        width={dim}
        height={dim}
        className="brand-logo__mark"
        priority={size !== "lg"}
        style={{ width: "auto", height: dim, maxHeight: dim, objectFit: "contain" }}
      />
      <span className="brand-logo__wordmark">{siteConfig.name}</span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="logo brand-logo-link" aria-label={`${siteConfig.name} — Início`}>
      {content}
    </Link>
  );
}
