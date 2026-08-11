"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AffiliateAccount, AffiliateProgram } from "@/lib/types";

const PROGRAMS: { value: AffiliateProgram; label: string }[] = [
  { value: "amazon", label: "Amazon" },
  { value: "hotmart", label: "Hotmart" },
  { value: "eduzz", label: "Eduzz" },
  { value: "monetizze", label: "Monetizze" },
  { value: "shopee", label: "Shopee" },
  { value: "mercado_livre", label: "Mercado Livre" },
  { value: "aliexpress", label: "AliExpress" },
  { value: "outro", label: "Outros" },
];

function emptyAffiliate(): AffiliateAccount {
  return {
    id: `aff-${Date.now()}`,
    program: "amazon",
    accountId: "",
    affiliateTag: "",
    active: true,
    createdAt: new Date().toISOString(),
  };
}

export default function AfiliadosAdminPage() {
  const [items, setItems] = useState<AffiliateAccount[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => setItems(d.affiliates || []));
  }, []);

  async function save() {
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_affiliates", data: items }),
    });
    const data = await res.json();
    if (data.affiliates) setItems(data.affiliates);
    setMsg("Programas de afiliados salvos.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>Afiliados</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Cadastre contas de afiliados. As comissões são pagas pelas plataformas diretamente a você.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.7rem" }}>
        <button className="btn btn--primary" type="button" onClick={() => setItems([emptyAffiliate(), ...items])}>
          Adicionar programa
        </button>
        <button className="btn btn--outline" type="button" onClick={save}>
          Salvar tudo
        </button>
      </div>

      {items.map((item, idx) => (
        <div className="admin-card admin-form" key={item.id}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
            <label>
              Programa
              <select
                value={item.program}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, program: e.target.value as AffiliateProgram };
                  setItems(next);
                }}
              >
                {PROGRAMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            {item.program === "outro" && (
              <label>
                Nome do programa
                <input
                  value={item.customName || ""}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, customName: e.target.value };
                    setItems(next);
                  }}
                />
              </label>
            )}
            <label>
              ID da conta
              <input
                value={item.accountId}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, accountId: e.target.value };
                  setItems(next);
                }}
              />
            </label>
            <label>
              Tag / código de afiliado
              <input
                value={item.affiliateTag}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, affiliateTag: e.target.value };
                  setItems(next);
                }}
              />
            </label>
            <label>
              URL do painel
              <input
                value={item.dashboardUrl || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, dashboardUrl: e.target.value };
                  setItems(next);
                }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "end", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...item, active: e.target.checked };
                  setItems(next);
                }}
              />
              Ativo
            </label>
          </div>
          <label>
            Observações
            <textarea
              rows={2}
              value={item.notes || ""}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...item, notes: e.target.value };
                setItems(next);
              }}
            />
          </label>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setItems(items.filter((a) => a.id !== item.id))}
          >
            Remover
          </button>
        </div>
      ))}

      {!items.length && (
        <div className="admin-card" style={{ color: "var(--text-muted)" }}>
          Nenhum programa cadastrado. Clique em “Adicionar programa”.
        </div>
      )}
      {msg && <p>{msg}</p>}
    </div>
  );
}
