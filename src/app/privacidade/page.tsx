import { siteConfig } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacidade",
  description: "Política de privacidade do SAÚDE INTEGRAL.",
  path: "/privacidade",
});

export default function PrivacidadePage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 className="section__title">Política de Privacidade</h1>
        <div className="prose" style={{ marginTop: "1.5rem" }}>
          <p>
            O {siteConfig.name} respeita a sua privacidade. Coletamos dados essenciais
            para analytics, newsletter e melhoria da experiência, conforme as
            configurações de cookies e ferramentas conectadas (GA4, GTM, AdSense).
          </p>
          <p>
            Você pode solicitar a remoção do seu e-mail da newsletter a qualquer
            momento pelo contato {siteConfig.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
