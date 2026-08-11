"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("newPassword") || "");
    const confirm = String(form.get("confirm") || "");
    if (newPassword !== confirm) {
      setLoading(false);
      setError("As senhas não coincidem.");
      return;
    }
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.get("currentPassword"),
        newPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Não foi possível alterar a senha.");
      return;
    }
    setOk(true);
    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 800);
  }

  return (
    <div className="admin-card" style={{ maxWidth: 520 }}>
      <h1 style={{ fontFamily: "var(--font-serif)", marginTop: 0 }}>Alterar senha</h1>
      <p style={{ color: "var(--text-muted)" }}>
        No primeiro acesso, a troca de senha é obrigatória. Use uma senha forte (mín. 10
        caracteres).
      </p>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Senha atual (temporária)
          <input name="currentPassword" type="password" required autoComplete="current-password" />
        </label>
        <label>
          Nova senha
          <input name="newPassword" type="password" required minLength={10} autoComplete="new-password" />
        </label>
        <label>
          Confirmar nova senha
          <input name="confirm" type="password" required minLength={10} autoComplete="new-password" />
        </label>
        {error && <p style={{ color: "#b42318" }}>{error}</p>}
        {ok && <p style={{ color: "#0a7a3e" }}>Senha atualizada. Redirecionando…</p>}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
