"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BannerConfig, BannerPosition } from "@/lib/types";

const POSITIONS: { value: BannerPosition; label: string }[] = [
  { value: "home-top", label: "Home — Topo" },
  { value: "home-feed", label: "Home — Feed" },
  { value: "article-sidebar", label: "Artigo — Lateral" },
  { value: "article-end", label: "Artigo — Final" },
  { value: "sponsor", label: "Patrocinado" },
  { value: "footer", label: "Rodapé" },
];

function emptyBanner(): BannerConfig {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `ban-${Date.now()}`,
    title: "",
    imageUrl: "",
    linkUrl: "",
    position: "sponsor",
    priority: 1,
    startDate: today,
    endDate: "",
    active: true,
    clicks: 0,
    impressions: 0,
  };
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => setBanners(d.banners || []));
  }, []);

  async function save() {
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_banners", data: banners }),
    });
    const data = await res.json();
    if (data.banners) setBanners(data.banners);
    setMsg("Banners salvos.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>Banners</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Cadastre imagem, link, período, posição e prioridade dos banners patrocinados.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.7rem" }}>
        <button className="btn btn--primary" type="button" onClick={() => setBanners([emptyBanner(), ...banners])}>
          Novo banner
        </button>
        <button className="btn btn--outline" type="button" onClick={save}>
          Salvar
        </button>
      </div>

      {banners.map((banner, idx) => (
        <div className="admin-card admin-form" key={banner.id}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
            <label>
              Título
              <input
                value={banner.title}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, title: e.target.value };
                  setBanners(next);
                }}
              />
            </label>
            <label>
              Posição
              <select
                value={banner.position}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, position: e.target.value as BannerPosition };
                  setBanners(next);
                }}
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              URL da imagem
              <input
                value={banner.imageUrl}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, imageUrl: e.target.value };
                  setBanners(next);
                }}
                placeholder="/images/banner.jpg ou https://..."
              />
            </label>
            <label>
              Link de destino
              <input
                value={banner.linkUrl}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, linkUrl: e.target.value };
                  setBanners(next);
                }}
              />
            </label>
            <label>
              Início
              <input
                type="date"
                value={banner.startDate}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, startDate: e.target.value };
                  setBanners(next);
                }}
              />
            </label>
            <label>
              Fim
              <input
                type="date"
                value={banner.endDate}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, endDate: e.target.value };
                  setBanners(next);
                }}
              />
            </label>
            <label>
              Prioridade
              <input
                type="number"
                value={banner.priority}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, priority: Number(e.target.value || 0) };
                  setBanners(next);
                }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "end", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={banner.active}
                onChange={(e) => {
                  const next = [...banners];
                  next[idx] = { ...banner, active: e.target.checked };
                  setBanners(next);
                }}
              />
              Ativo
            </label>
          </div>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setBanners(banners.filter((b) => b.id !== banner.id))}
          >
            Remover
          </button>
        </div>
      ))}
      {msg && <p>{msg}</p>}
    </div>
  );
}
