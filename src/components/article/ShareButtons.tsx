"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/components/providers/AnalyticsProvider";

export function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`ei-like-${slug}`) === "1");
    setSaved(localStorage.getItem(`ei-save-${slug}`) === "1");
  }, [slug]);

  const url = typeof window !== "undefined" ? window.location.href : "";

  async function share(network?: string) {
    const shareUrl = window.location.href;
    if (!network && navigator.share) {
      await navigator.share({ title, url: shareUrl });
      trackEvent("share", { method: "native", slug });
      return;
    }
    const map: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    if (network && map[network]) {
      window.open(map[network], "_blank", "noopener,noreferrer");
      trackEvent("share", { method: network, slug });
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href || url);
    setCopied(true);
    trackEvent("copy_link", { slug });
    setTimeout(() => setCopied(false), 1800);
  }

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    localStorage.setItem(`ei-like-${slug}`, next ? "1" : "0");
    trackEvent("cta_click", { label: next ? "like" : "unlike", slug });
  }

  function toggleSave() {
    const next = !saved;
    setSaved(next);
    localStorage.setItem(`ei-save-${slug}`, next ? "1" : "0");
    trackEvent("cta_click", { label: next ? "save" : "unsave", slug });
  }

  return (
    <div className="share-bar" aria-label="Compartilhar e engajar">
      <button type="button" onClick={() => share()}>
        Compartilhar
      </button>
      <button type="button" onClick={() => share("whatsapp")}>
        WhatsApp
      </button>
      <button type="button" onClick={copyLink}>
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <button type="button" onClick={toggleLike} aria-pressed={liked}>
        {liked ? "Curtido" : "Curtir"}
      </button>
      <button type="button" onClick={toggleSave} aria-pressed={saved}>
        {saved ? "Salvo" : "Salvar"}
      </button>
    </div>
  );
}
