"use client";

type ArticleAudioProps = {
  src: string;
  title: string;
};

export function ArticleAudio({ src, title }: ArticleAudioProps) {
  if (!src) return null;

  return (
    <aside className="article-audio" aria-label="Áudio do artigo">
      <div className="article-audio__head">
        <span className="article-audio__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </span>
        <div>
          <strong className="article-audio__label">Ouça este artigo</strong>
          <p className="article-audio__sub">{title}</p>
        </div>
      </div>
      <audio className="article-audio__player" controls preload="none" src={src}>
        Seu navegador não suporta áudio.
      </audio>
    </aside>
  );
}
