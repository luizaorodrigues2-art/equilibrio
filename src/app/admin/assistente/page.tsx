"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SetupStepId, SetupWizardState } from "@/lib/types";

const STEPS: {
  id: SetupStepId;
  title: string;
  description: string;
  href: string;
  hint?: string;
}[] = [
  {
    id: "ga4",
    title: "1. Conectar Google Analytics",
    description: "Defina NEXT_PUBLIC_GA4_ID no .env ou confirme que o GA4 já está ativo.",
    href: "/admin/assistente",
    hint: "Ex.: G-XXXXXXXXXX",
  },
  {
    id: "gsc",
    title: "2. Conectar Google Search Console",
    description: "Adicione NEXT_PUBLIC_GSC_VERIFICATION e valide a propriedade no GSC.",
    href: "/robots.txt",
  },
  {
    id: "gtm",
    title: "3. Conectar Google Tag Manager",
    description: "Configure NEXT_PUBLIC_GTM_ID (GTM-XXXXXXX) para a dataLayer.",
    href: "/admin/assistente",
  },
  {
    id: "adsense",
    title: "4. Inserir Publisher ID do Google AdSense",
    description: "Cadastre Client ID e script na Central de Monetização.",
    href: "/admin/monetizacao/adsense",
  },
  {
    id: "ad_slots",
    title: "5. Configurar espaços de anúncios",
    description: "Ative os slots estratégicos do portal.",
    href: "/admin/anuncios",
  },
  {
    id: "affiliates",
    title: "6. Cadastrar programas de afiliados",
    description: "Amazon, Hotmart, Eduzz e outros.",
    href: "/admin/monetizacao/afiliados",
  },
  {
    id: "newsletter",
    title: "7. Configurar newsletter",
    description: "Valide a captura de e-mails e acompanhe os leads.",
    href: "/admin/newsletter",
  },
  {
    id: "seo",
    title: "8. Verificar SEO",
    description: "Confira sitemap, metadados e páginas de artigo.",
    href: "/sitemap.xml",
  },
  {
    id: "indexing",
    title: "9. Testar indexação",
    description: "Envie o sitemap no Search Console e revise o robots.txt.",
    href: "/robots.txt",
  },
  {
    id: "first_article",
    title: "10. Publicar o primeiro artigo",
    description: "Publique conteúdo ou confirme que os artigos importados estão no ar.",
    href: "/admin/artigos",
  },
];

export default function AssistentePage() {
  const [setup, setSetup] = useState<SetupWizardState | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sync_setup" }),
    });
    const res = await fetch("/api/monetization?view=setup");
    setSetup(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(step: SetupStepId, done: boolean) {
    const res = await fetch("/api/monetization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setup_step", step, done }),
    });
    const data = await res.json();
    if (data.setup) setSetup(data.setup);
  }

  if (loading || !setup) {
    return <div className="admin-card">Carregando assistente...</div>;
  }

  const doneCount = Object.values(setup.steps).filter(Boolean).length;
  const total = STEPS.length;
  const progress = Math.round((doneCount / total) * 100);

  return (
    <div style={{ display: "grid", gap: "1.2rem", maxWidth: 880 }}>
      <div>
        <h1 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>Assistente de configuração</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Conclua as 10 etapas para deixar o portal pronto para visitantes e monetização.
        </p>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <strong>
            Progresso: {doneCount}/{total}
          </strong>
          <span>{progress}%</span>
        </div>
        <div className="wizard-progress">
          <div className="wizard-progress__bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {setup.completed ? (
        <div className="admin-card wizard-success">
          <h2 style={{ fontFamily: "var(--font-serif)", marginTop: 0 }}>
            Seu portal está pronto para começar a receber visitantes e monetizar.
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Todas as etapas foram concluídas. Continue publicando conteúdo, monitorando a receita e
            otimizando os espaços de anúncio.
          </p>
          <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
            <Link href="/admin/monetizacao" className="btn btn--primary">
              Ir para Monetização
            </Link>
            <Link href="/" className="btn btn--outline">
              Ver site
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            Marque cada etapa após concluí-la. Algumas são detectadas automaticamente (artigos,
            AdSense, newsletter).
          </p>
        </div>
      )}

      <div style={{ display: "grid", gap: "0.8rem" }}>
        {STEPS.map((step) => {
          const done = setup.steps[step.id];
          return (
            <div
              key={step.id}
              className={`admin-card wizard-step ${done ? "wizard-step--done" : ""}`}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.35rem", fontFamily: "var(--font-serif)" }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>{step.description}</p>
                  {step.hint && (
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--color-gold)" }}>
                      {step.hint}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                  <Link href={step.href} className="btn btn--outline">
                    Abrir
                  </Link>
                  <button
                    type="button"
                    className={`btn ${done ? "btn--primary" : "btn--outline"}`}
                    onClick={() => toggle(step.id, !done)}
                  >
                    {done ? "Concluído" : "Marcar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
