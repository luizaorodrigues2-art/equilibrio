"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { AdManagerBlock, AdManagerConfig } from "@/lib/types";

const emptyBlock = (): AdManagerBlock => ({
  id: `block-${Date.now()}`,
  name: "",
  adUnitPath: "",
  sizes: "300x250",
  enabled: true,
});

export default function AdManagerAdminPage() {
  const [form, setForm] = useState<AdManagerConfig>({
    networkId: "",
    tags: [],
    blocks: [],
  });
  const [tagsText, setTagsText] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => {
        if (d.adManager) {
          setForm(d.adManager);
          setTagsText((d.adManager.tags || []).join(", "));
        }
      });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_ad_manager", data: payload }),
    });
    const data = await res.json();
    if (data.adManager) setForm(data.adManager);
    setMsg("Google Ad Manager salvo.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 900 }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>Google Ad Manager</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Cadastre Network ID, tags e blocos (ad units) para inventário avançado.
        </p>
      </div>

      <form className="admin-form admin-card" onSubmit={save}>
        <label>
          Network ID
          <input
            value={form.networkId}
            onChange={(e) => setForm({ ...form, networkId: e.target.value })}
            placeholder="Ex: 12345678"
          />
        </label>
        <label>
          Tags (separadas por vírgula)
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="home, artigo, sidebar"
          />
        </label>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>Blocos</h2>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setForm({ ...form, blocks: [...form.blocks, emptyBlock()] })}
          >
            Adicionar bloco
          </button>
        </div>

        {form.blocks.map((block, idx) => (
          <div key={block.id} className="admin-card" style={{ boxShadow: "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
              <label>
                Nome
                <input
                  value={block.name}
                  onChange={(e) => {
                    const blocks = [...form.blocks];
                    blocks[idx] = { ...block, name: e.target.value };
                    setForm({ ...form, blocks });
                  }}
                />
              </label>
              <label>
                Ad Unit Path
                <input
                  value={block.adUnitPath}
                  onChange={(e) => {
                    const blocks = [...form.blocks];
                    blocks[idx] = { ...block, adUnitPath: e.target.value };
                    setForm({ ...form, blocks });
                  }}
                  placeholder="/network/unit"
                />
              </label>
              <label>
                Tamanhos
                <input
                  value={block.sizes}
                  onChange={(e) => {
                    const blocks = [...form.blocks];
                    blocks[idx] = { ...block, sizes: e.target.value };
                    setForm({ ...form, blocks });
                  }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "end", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={block.enabled}
                  onChange={(e) => {
                    const blocks = [...form.blocks];
                    blocks[idx] = { ...block, enabled: e.target.checked };
                    setForm({ ...form, blocks });
                  }}
                />
                Ativo
              </label>
            </div>
            <button
              type="button"
              className="btn btn--outline"
              style={{ marginTop: "0.7rem" }}
              onClick={() =>
                setForm({ ...form, blocks: form.blocks.filter((b) => b.id !== block.id) })
              }
            >
              Remover
            </button>
          </div>
        ))}

        <button className="btn btn--primary" type="submit">
          Salvar Ad Manager
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
