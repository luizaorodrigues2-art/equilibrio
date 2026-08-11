"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/components/providers/AnalyticsProvider";

export function NewsletterForm({
  compact = false,
  source = "site",
}: {
  compact?: boolean;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setStatus("ok");
      setMessage("Inscrição confirmada. Obrigado!");
      setEmail("");
      trackEvent("newsletter_signup", { source });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Não foi possível insccrever.");
    }
  }

  return (
    <form className="newsletter__form" onSubmit={onSubmit} style={compact ? { marginTop: "0.75rem" } : undefined}>
      <input
        type="email"
        required
        name="email"
        autoComplete="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="E-mail para newsletter"
      />
      <button className="btn btn--primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Assinar"}
      </button>
      {message && (
        <p style={{ width: "100%", margin: 0, fontSize: "0.9rem", opacity: 0.9 }} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
