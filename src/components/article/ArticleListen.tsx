"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Narração do artigo via Web Speech API (voz do próprio navegador).
 * Acessibilidade: permite OUVIR o texto — sem custo, sem chave, sem arquivos.
 */

function splitChunks(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]*/g) || [clean];
  const chunks: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > 220 && cur) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.55rem 1.1rem",
  borderRadius: "100px",
  border: "1px solid rgba(201,169,110,0.45)",
  background: "rgba(201,169,110,0.12)",
  color: "#e8dcc4",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  ...btn,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.22)",
  color: "#f8f6f2",
  fontWeight: 500,
};

export function ArticleListen({ text, title }: { text: string; title: string }) {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const pick = () => {
      const vs = window.speechSynthesis.getVoices();
      voiceRef.current =
        vs.find((v) => /pt[-_]br/i.test(v.lang)) ||
        vs.find((v) => /^pt/i.test(v.lang)) ||
        null;
    };
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pick);
      window.speechSynthesis.cancel();
    };
  }, []);

  function play() {
    const synth = window.speechSynthesis;
    synth.cancel();
    const chunks = splitChunks(`${title}. ${text}`);
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = "pt-BR";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 1;
      u.pitch = 1;
      if (i === chunks.length - 1) u.onend = () => setStatus("idle");
      synth.speak(u);
    });
    setStatus("playing");
  }

  function pause() {
    window.speechSynthesis.pause();
    setStatus("paused");
  }
  function resume() {
    window.speechSynthesis.resume();
    setStatus("playing");
  }
  function stop() {
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  if (!supported) return null;

  return (
    <aside
      aria-label="Ouvir o artigo"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.7rem",
        padding: "0.9rem 1.1rem",
        margin: "0 0 1.5rem",
        borderRadius: "16px",
        background: "rgba(10,31,53,0.55)",
        border: "1px solid rgba(201,169,110,0.18)",
      }}
    >
      <span
        aria-hidden="true"
        style={{ display: "inline-flex", color: "#c9a96e" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
        </svg>
      </span>
      <span style={{ marginRight: "auto", fontSize: "0.88rem", color: "rgba(232,220,196,0.75)" }}>
        Prefere ouvir? Narração por voz do navegador.
      </span>

      {status === "idle" && (
        <button type="button" style={btn} onClick={play}>
          ▶ Ouvir artigo
        </button>
      )}
      {status === "playing" && (
        <>
          <button type="button" style={btn} onClick={pause}>
            ⏸ Pausar
          </button>
          <button type="button" style={btnGhost} onClick={stop}>
            ⏹ Parar
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <button type="button" style={btn} onClick={resume}>
            ▶ Continuar
          </button>
          <button type="button" style={btnGhost} onClick={stop}>
            ⏹ Parar
          </button>
        </>
      )}
    </aside>
  );
}
