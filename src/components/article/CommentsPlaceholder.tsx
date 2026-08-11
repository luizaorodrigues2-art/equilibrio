export function CommentsPlaceholder() {
  return (
    <section className="comments" aria-label="Comentários">
      <h2 style={{ fontFamily: "var(--font-serif)", marginTop: 0 }}>Comentários</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Estrutura preparada para integração com sistema de comentários
        (Disqus, Giscus, Hyvor ou moderação própria). Em breve você poderá
        participar da conversa aqui.
      </p>
      <div style={{ display: "grid", gap: "0.7rem" }}>
        <input
          disabled
          placeholder="Seu nome"
          aria-label="Nome"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "0.75rem",
            background: "var(--bg)",
          }}
        />
        <textarea
          disabled
          placeholder="Escreva um comentário..."
          rows={4}
          aria-label="Comentário"
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "0.75rem",
            background: "var(--bg)",
            resize: "vertical",
          }}
        />
        <button className="btn btn--outline" type="button" disabled>
          Comentários em breve
        </button>
      </div>
    </section>
  );
}
