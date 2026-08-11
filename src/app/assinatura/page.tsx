import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Assinatura Premium",
  description:
    "Planos Essencial e Premium do SAÚDE INTEGRAL: conteúdos exclusivos diários, inspiração e acesso antecipado às novidades. A partir de R$ 9,90/mês.",
  path: "/assinatura",
  keywords: [
    "assinatura saúde integral",
    "plano premium bem-estar",
    "conteúdo diário saúde mental",
    "newsletter premium",
  ],
});

const WHATSAPP_NUMBER = "5511944697317";

function whatsappHref(plan: string) {
  const text = encodeURIComponent(
    `Olá! Tenho interesse no ${plan} do SAÚDE INTEGRAL. Gostaria de receber as informações para ativação da assinatura.`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

const essencialBenefits = [
  "Frase motivacional exclusiva todos os dias",
  "Reflexão diária sobre saúde mental e bem-estar",
  "Resumo dos novos artigos publicados",
  "Dicas práticas para reduzir ansiedade e estresse",
  "Técnicas simples de autocuidado",
  "Mensagem inspiradora para começar o dia",
  "Conteúdo sobre equilíbrio entre mente e corpo",
  "Acesso antecipado às novidades do portal",
  "Newsletter Premium",
  "Cancelamento quando desejar",
];

const premiumExtras = [
  "Frases motivacionais diárias exclusivas",
  "Conteúdo premium enviado diariamente",
  "Reflexões mais aprofundadas",
  "Artigos exclusivos para assinantes",
  "Guias práticos em PDF",
  "Checklists de bem-estar",
  "Exercícios de mindfulness",
  "Exercícios de respiração",
  "Técnicas de inteligência emocional",
  "Conteúdos sobre espiritualidade e desenvolvimento pessoal",
  "Meditações guiadas em texto",
  "Desafios semanais para evolução pessoal",
  "Calendário mensal de hábitos saudáveis",
  "Recomendações de livros",
  "Recomendações de filmes e documentários",
  "Conteúdos especiais antes da publicação no portal",
  "Acesso às futuras áreas exclusivas para assinantes",
  "Prioridade em novidades e lançamentos",
  "Cancelamento quando desejar",
];

const deliveryItems = [
  "Uma mensagem inspiradora para começar o dia",
  "Uma frase motivacional exclusiva",
  "Reflexões sobre saúde mental",
  "Dicas de equilíbrio emocional",
  "Novos artigos publicados",
  "Conteúdos exclusivos (Plano Premium)",
  "Materiais especiais",
  "Novidades do SAÚDE INTEGRAL",
];

const subscriberBenefits = [
  "Conteúdo diário",
  "Desenvolvimento pessoal contínuo",
  "Organização das mensagens por tema",
  "Conteúdo sem spam",
  "Cancelamento simples",
  "Atualizações constantes",
  "Acesso prioritário às novidades",
  "Plataforma em constante evolução",
];

function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="plan-benefits">
      {items.map((item) => (
        <li key={item}>
          <span className="plan-check" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AssinaturaPage() {
  return (
    <>
      <section className="plans-hero" aria-label="Assinatura Premium">
        <div className="container plans-hero__inner fade-in">
          <p className="section__eyebrow">Portal SAÚDE INTEGRAL</p>
          <h1 className="plans-hero__brand">
            SAÚDE <em>INTEGRAL</em>
          </h1>
          <p className="plans-hero__lead">
            Transforme sua rotina com conteúdos exclusivos, inspiração diária e acesso
            antecipado às novidades do portal.
          </p>
          <p className="plans-hero__sub">
            Equilíbrio que transforma. Vida que floresce. Receba todos os dias conteúdos
            para fortalecer mente, corpo e espiritualidade.
          </p>
          <div className="plans-hero__actions">
            <a
              href="#planos"
              className="btn btn--primary"
              data-track="cta_click"
              data-track-label="assinatura_ver_planos"
            >
              Ver planos
            </a>
            <a
              href={whatsappHref("Plano Premium")}
              className="btn btn--outline"
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_click"
              data-track-label="assinatura_whatsapp_hero"
            >
              Assinar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="planos">
        <div className="container">
          <div className="section__head">
            <div>
              <div className="section__eyebrow">Planos</div>
              <h2 className="section__title">Escolha sua assinatura</h2>
              <p className="section__desc">
                Do hábito diário do autocuidado ao conteúdo premium completo — cancele
                quando desejar.
              </p>
            </div>
          </div>

          <div className="plans-grid">
            <article className="plan-card">
              <div className="plan-card__top">
                <h3 className="plan-card__name">Plano Essencial</h3>
                <p className="plan-card__price">
                  R$ 9,90<span>/mês</span>
                </p>
                <p className="plan-card__tagline">
                  Ideal para quem deseja criar o hábito diário do autocuidado.
                </p>
              </div>
              <p className="plan-card__label">Você recebe</p>
              <BenefitList items={essencialBenefits} />
              <a
                href={whatsappHref("Plano Essencial")}
                className="btn btn--outline plan-card__cta"
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_click"
                data-track-label="assinatura_essencial"
              >
                Assinar Essencial
              </a>
            </article>

            <article className="plan-card plan-card--featured">
              <div className="plan-card__badge">Mais completo</div>
              <div className="plan-card__top">
                <h3 className="plan-card__name">Plano Premium</h3>
                <p className="plan-card__price">
                  R$ 19,90<span>/mês</span>
                </p>
                <p className="plan-card__tagline">Tudo do Plano Essencial +</p>
              </div>
              <p className="plan-card__label">Benefícios Premium</p>
              <BenefitList items={premiumExtras} />
              <a
                href={whatsappHref("Plano Premium")}
                className="btn btn--primary plan-card__cta"
                target="_blank"
                rel="noopener noreferrer"
                data-track="cta_click"
                data-track-label="assinatura_premium"
              >
                Assinar Premium
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="section plans-band">
        <div className="container">
          <div className="section__head">
            <div>
              <div className="section__eyebrow">Entrega</div>
              <h2 className="section__title">Como você receberá</h2>
              <p className="section__desc">
                Todos os dias você receberá em seu e-mail:
              </p>
            </div>
          </div>
          <ul className="plans-delivery">
            {deliveryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section__head">
            <div>
              <div className="section__eyebrow">Vantagens</div>
              <h2 className="section__title">Benefícios do assinante</h2>
            </div>
          </div>
          <ul className="plans-perks">
            {subscriberBenefits.map((item) => (
              <li key={item}>
                <span className="plan-check" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section plans-cta" id="assine">
        <div className="container plans-cta__inner">
          <div className="section__eyebrow">Assine agora</div>
          <h2 className="section__title">Fale conosco no WhatsApp</h2>
          <p className="section__desc">
            Entre em contato pelo WhatsApp{" "}
            <strong>(11) 94469-7317</strong>. Nossa equipe enviará todas as informações
            para ativação da sua assinatura.
          </p>
          <div className="plans-cta__actions">
            <a
              href={whatsappHref("Plano Premium")}
              className="btn btn--primary"
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta_click"
              data-track-label="assinatura_whatsapp_cta"
            >
              WhatsApp (11) 94469-7317
            </a>
            <Link
              href="/contato"
              className="btn btn--outline"
              data-track="cta_click"
              data-track-label="assinatura_contato"
            >
              Outras formas de contato
            </Link>
          </div>
        </div>
      </section>

      <section className="section plans-mission">
        <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
          <div className="section__eyebrow">Missão</div>
          <h2 className="section__title" style={{ marginInline: "auto" }}>
            Por que existimos
          </h2>
          <p className="plans-mission__text">
            Levar inspiração, equilíbrio, conhecimento e qualidade de vida até você todos
            os dias, por meio de conteúdos cuidadosamente preparados para fortalecer sua
            mente, seu corpo e seu bem-estar.
          </p>
        </div>
      </section>
    </>
  );
}
