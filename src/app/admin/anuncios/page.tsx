"use client";

import { useEffect, useState } from "react";
import type { AdSlotConfig } from "@/lib/types";

export default function AdminAdsPage() {
  const [slots, setSlots] = useState<AdSlotConfig[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .catch(() => setMessage("Faça login para gerenciar anúncios."));
  }, []);

  async function save() {
    const res = await fetch("/api/ads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });
    if (res.ok) setMessage("Espaços de anúncio salvos.");
    else setMessage("Erro ao salvar.");
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>Anúncios e monetização</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Controle slots para AdSense, Ad Manager, Ezoic, Mediavine, Raptive, Taboola e Outbrain.
        </p>
      </div>
      {slots.map((slot, idx) => (
        <div className="admin-card" key={slot.id}>
          <strong>{slot.label}</strong>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.7rem", marginTop: "0.7rem" }}>
            <label>
              Provider
              <select
                value={slot.provider}
                onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...slot, provider: e.target.value as AdSlotConfig["provider"] };
                  setSlots(next);
                }}
              >
                <option value="adsense">AdSense</option>
                <option value="admanager">Ad Manager</option>
                <option value="ezoic">Ezoic</option>
                <option value="mediavine">Mediavine</option>
                <option value="raptive">Raptive</option>
                <option value="taboola">Taboola</option>
                <option value="outbrain">Outbrain</option>
                <option value="custom">Custom / Afiliado</option>
              </select>
            </label>
            <label>
              Posição
              <input
                value={slot.position}
                onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...slot, position: e.target.value };
                  setSlots(next);
                }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "end", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={slot.enabled}
                onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...slot, enabled: e.target.checked };
                  setSlots(next);
                }}
              />
              Ativo
            </label>
          </div>
          <label style={{ display: "grid", gap: "0.35rem", marginTop: "0.7rem" }}>
            Código / snippet
            <textarea
              rows={3}
              value={slot.code || ""}
              onChange={(e) => {
                const next = [...slots];
                next[idx] = { ...slot, code: e.target.value };
                setSlots(next);
              }}
              placeholder="Cole aqui o código do anúncio quando disponível"
            />
          </label>
        </div>
      ))}
      <button className="btn btn--primary" type="button" onClick={save}>
        Salvar espaços
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
