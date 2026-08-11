"use client";

import { useEffect } from "react";

/** Soft cursor glow + hero media parallax for cinematic home. */
export function AmbientPointer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const root = document.body;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--ptr-x", `${e.clientX}px`);
      root.style.setProperty("--ptr-y", `${e.clientY}px`);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--parallax-x", `${cx * 12}px`);
      root.style.setProperty("--parallax-y", `${cy * 8}px`);
      const media = document.querySelector<HTMLElement>(".cinema-hero__media");
      if (media) {
        media.style.transform = `translate3d(${cx * 14}px, ${cy * 10}px, 0) scale(1.06)`;
      }
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cinema-pointer-glow" aria-hidden="true" />;
}
