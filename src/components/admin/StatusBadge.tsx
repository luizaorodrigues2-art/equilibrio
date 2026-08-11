const LABELS: Record<string, string> = {
  nao_configurado: "Não configurado",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  ativo: "Ativo",
  conectado: "Conectado",
  pausado: "Pausado",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {LABELS[status] || status}
    </span>
  );
}
