"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdNetworkConfig } from "@/lib/types";
import { StatusBadge } from "@/components/admin/StatusBadge";

const LABELS: Record<string, string> = {
  ezoic: "Ezoic",
  mediavine: "Mediavine",
  raptive: "Raptive",
  monetag: "Monetag",
  propellerads: "PropellerAds",
  taboola: "Taboola",
  outbrain: "Outbrain",
};

export default function RedesAdminPage() {
  const [networks, setNetworks] = useState<AdNetworkConfig[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => setNetworks(d.networks || []));
  }, []);

  async function save() {
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_networks", data: networks }),
    });
    const data = await res.json();
    if (data.networks) setNetworks(data.networks);
    setMsg("Redes de anúncios salvas.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>Redes de anúncios</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Prepare integrações com redes premium. Quando houver API oficial, os dados de receita
          poderão ser importados; caso contrário, use lançamento manual no painel de receita.
        </p>
      </div>

      {networks.map((net, idx) => (
        <div className="admin-card admin-form" key={net.id}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>
              {LABELS[net.provider] || net.provider}
            </h2>
            <StatusBadge status={net.status} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
            <label>
              Account / Site ID
              <input
                value={net.accountId}
                onChange={(e) => {
                  const next = [...networks];
                  next[idx] = { ...net, accountId: e.target.value };
                  setNetworks(next);
                }}
              />
            </label>
            <label>
              Site ID (opcional)
              <input
                value={net.siteId || ""}
                onChange={(e) => {
                  const next = [...networks];
                  next[idx] = { ...net, siteId: e.target.value };
                  setNetworks(next);
                }}
              />
            </label>
            <label>
              API Key (se disponível)
              <input
                type="password"
                value={net.apiKey || ""}
                onChange={(e) => {
                  const next = [...networks];
                  next[idx] = { ...net, apiKey: e.target.value };
                  setNetworks(next);
                }}
                placeholder="Armazenada apenas no servidor"
              />
            </label>
            <label>
              Status
              <select
                value={net.status}
                onChange={(e) => {
                  const next = [...networks];
                  next[idx] = {
                    ...net,
                    status: e.target.value as AdNetworkConfig["status"],
                  };
                  setNetworks(next);
                }}
              >
                <option value="nao_configurado">Não configurado</option>
                <option value="conectado">Conectado</option>
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
              </select>
            </label>
          </div>
          <label>
            Script / snippet
            <textarea
              rows={3}
              value={net.script || ""}
              onChange={(e) => {
                const next = [...networks];
                next[idx] = { ...net, script: e.target.value };
                setNetworks(next);
              }}
            />
          </label>
        </div>
      ))}

      <button className="btn btn--primary" type="button" onClick={save}>
        Salvar redes
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
