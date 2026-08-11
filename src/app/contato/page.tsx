import { siteConfig } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contato",
  description: "Fale com a equipe do SAÚDE INTEGRAL.",
  path: "/contato",
});

export default function ContatoPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="section__eyebrow">Contato</div>
        <h1 className="section__title">Vamos conversar</h1>
        <p className="section__desc">
          Parcerias, sugestões de pauta, imprensa ou dúvidas: envie uma mensagem.
        </p>
        <form className="admin-form" style={{ marginTop: "1.5rem" }} action={`mailto:${siteConfig.email}`} method="post" encType="text/plain">
          <label>
            Nome
            <input name="nome" required placeholder="Seu nome" />
          </label>
          <label>
            E-mail
            <input type="email" name="email" required placeholder="voce@email.com" />
          </label>
          <label>
            Assunto
            <input name="assunto" required placeholder="Como podemos ajudar?" />
          </label>
          <label>
            Mensagem
            <textarea name="mensagem" rows={6} required placeholder="Escreva sua mensagem" />
          </label>
          <button className="btn btn--primary" type="submit" data-track="cta_click" data-track-label="contato_enviar">
            Enviar mensagem
          </button>
        </form>
        <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>
          E-mail direto: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </p>
      </div>
    </section>
  );
}
