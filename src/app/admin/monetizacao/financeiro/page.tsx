"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { BankingInfo } from "@/lib/types";

export default function FinanceiroAdminPage() {
  const [form, setForm] = useState<BankingInfo>({
    holderName: "",
    document: "",
    bank: "",
    agency: "",
    account: "",
    pixKey: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/monetization")
      .then((r) => r.json())
      .then((d) => {
        if (d.banking) setForm(d.banking);
      });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_banking", data: form }),
    });
    const data = await res.json();
    if (data.banking) setForm(data.banking);
    setMsg("Dados salvos com segurança no servidor (apenas admin).");
  }

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
      <div>
        <Link href="/admin/monetizacao" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Monetização
        </Link>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: "0.4rem 0" }}>
          PIX e dados bancários
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Área exclusiva para organização administrativa. Estes dados{" "}
          <strong>nunca são enviados a terceiros</strong> nem exibidos no site público.
        </p>
      </div>

      <div className="admin-card" style={{ borderColor: "rgba(201,169,110,0.5)" }}>
        <strong>Privacidade</strong>
        <p style={{ margin: "0.4rem 0 0", color: "var(--text-muted)" }}>
          Use este cadastro apenas como referência interna. Os pagamentos das plataformas
          (AdSense, Hotmart etc.) continuam indo para as contas que você cadastrou nelas.
        </p>
      </div>

      <form className="admin-form admin-card" onSubmit={save}>
        <label>
          Nome do titular
          <input
            value={form.holderName}
            onChange={(e) => setForm({ ...form, holderName: e.target.value })}
            autoComplete="off"
          />
        </label>
        <label>
          CPF / CNPJ
          <input
            value={form.document}
            onChange={(e) => setForm({ ...form, document: e.target.value })}
            autoComplete="off"
          />
        </label>
        <label>
          Banco
          <input
            value={form.bank}
            onChange={(e) => setForm({ ...form, bank: e.target.value })}
          />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
          <label>
            Agência
            <input
              value={form.agency}
              onChange={(e) => setForm({ ...form, agency: e.target.value })}
            />
          </label>
          <label>
            Conta
            <input
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
            />
          </label>
        </div>
        <label>
          Chave PIX
          <input
            value={form.pixKey}
            onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
            autoComplete="off"
          />
        </label>
        <label>
          Observações internas
          <textarea
            rows={3}
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>
        <button className="btn btn--primary" type="submit">
          Salvar dados bancários
        </button>
        {msg && <p role="status">{msg}</p>}
      </form>
    </div>
  );
}
