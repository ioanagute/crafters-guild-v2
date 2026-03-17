import { useId } from "react";
import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  compact?: boolean;
}) {
  const gradientId = useId();

  return (
    <header className={`${compact ? "mb-6" : "mb-8"} section-panel relative overflow-hidden px-6 py-6 md:px-8 md:py-8`}>
      {/* Background Texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      {/* Top Ornate Border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
          <path d="M0 1C20 1 40 7 60 7C80 7 100 1 120 1" stroke={`url(#${gradientId})`} strokeWidth="1.5"/>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="transparent"/>
              <stop offset="0.5" stopColor="#d4af37"/>
              <stop offset="1" stopColor="transparent"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-4 bg-gold-600/50" />
              <p className="eyebrow !mb-0">{eyebrow}</p>
            </div>
          ) : null}
          <h1 className={`font-serif tracking-[0.14em] text-gold-accent ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} drop-shadow-sm`}>
            {title}
          </h1>
          {description ? (
            <p className={`mt-4 max-w-2xl leading-relaxed text-parchment-300/90 ${compact ? "text-sm md:text-base" : "text-base md:text-lg"}`}>
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
      </div>
      {meta ? <div className="panel-divider relative z-10 mt-6 pt-5">{meta}</div> : null}
    </header>
  );
}
