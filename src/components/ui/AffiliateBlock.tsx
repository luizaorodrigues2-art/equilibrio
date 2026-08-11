export function AffiliateBlock() {
  return (
    <aside className="affiliate" data-affiliate-block="true" aria-label="Recomendações">
      <h3>Recomendado para você</h3>
      <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
        Espaço preparado para links de afiliados (Amazon, Hotmart e parceiros).
        Insira ofertas contextuais sem interromper a leitura.
      </p>
      <span className="btn btn--outline" data-track="cta_click" data-track-label="affiliate_placeholder">
        Bloco de afiliado pronto
      </span>
    </aside>
  );
}
