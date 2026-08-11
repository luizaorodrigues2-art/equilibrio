"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  track?: string;
};

export function MagneticButton({ href, children, className = "", track }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={`btn-cinema magnetic-btn ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-track="cta_click"
      data-track-label={track}
    >
      {children}
    </Link>
  );
}
