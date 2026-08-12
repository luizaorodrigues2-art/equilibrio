import type { DailyReflection } from "@/lib/daily";
import { Reveal } from "@/components/cinema/Reveal";

export function DailyPill({ reflection }: { reflection: DailyReflection | null }) {
  if (!reflection) return null;

  return (
    <section className="cinema-section daily-pill" aria-labelledby="daily-pill-title">
      <div className="cinema-container">
        <Reveal>
          <div className="daily-pill__card">
            <div className="daily-pill__meta">
              <span className="daily-pill__label">Pílula Diária</span>
              <span className="daily-pill__pillar">{reflection.pillar}</span>
            </div>
            <h2 id="daily-pill-title" className="daily-pill__title">
              {reflection.title}
            </h2>
            <p className="daily-pill__body">{reflection.body}</p>
            <p className="daily-pill__hint">Seu momento diário — um minuto para você.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
