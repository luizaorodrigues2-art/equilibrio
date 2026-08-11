"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { AdSenseConfig, AdSenseStatus } from "@/lib/types";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdSenseAdminPage() {
  const [form, setForm] = useState<AdSenseConfig>({
    publisherId: "",
    clientId: "",
    script: "",
    status: "nao_configurado",
    scriptInstalled: false,
  });
  const [checkMsg, setCheckMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => {
        if (d.adsense) setForm(d.adsense);
      });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_adsense", data: form }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.adsense) setForm(data.adsense);
    setCheckMsg(data.check?.message || "Salvo.");
  }

  async function verify() {
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify_adsense", status: form.status }),
    });
    const data = await res.json();
    if (data.adsense) setForm(data.adsense);
    setCheckMsg(data.check?.message || "Verificação concluída.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 820 }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>Google AdSense</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Cadastre o Publisher/Client ID e o script. O pagamento continua sendo feito pelo Google
          para a conta AdSense do proprietário.
        </p>
      </div>

      <div className="admin-card" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          Status atual: <StatusBadge status={form.status} />
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          Script: {form.scriptInstalled ? "instalado corretamente" : "não detectado"}
        </div>
        {form.lastCheckedAt && (
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Última verificação: {new Date(form.lastCheckedAt).toLocaleString("pt-BR")}
          </div>
        )}
      </div>

      <form className="admin-form admin-card" onSubmit={save}>
        <label>
          Publisher ID
          <input
            value={form.publisherId}
            onChange={(e) => setForm({ ...form, publisherId: e.target.value })}
            placeholder="pub-XXXXXXXXXXXXXXXX"
          />
        </label>
        <label>
          Client ID
          <input
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          />
        </label>
        <label>
          Script do AdSense
          <textarea
            rows={6}
            value={form.script}
            onChange={(e) => setForm({ ...form, script: e.target.value })}
            placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>'
          />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AdSenseStatus })}
          >
            <option value="nao_configurado">Não configurado</option>
            <option value="em_analise">Em análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="ativo">Ativo</option>
          </select>
        </label>
        <label>
          Observações
          <textarea
            rows={2}
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <button className="btn btn--primary" type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar AdSense"}
          </button>
          <button className="btn btn--outline" type="button" onClick={verify}>
            Verificar instalação
          </button>
        </div>
        {checkMsg && <p role="status">{checkMsg}</p>}
      </form>
    </div>
  );
}
