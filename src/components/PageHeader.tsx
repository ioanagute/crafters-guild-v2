import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 border-b-2 border-gold-600 pb-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-gold-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-4xl tracking-widest text-gold-accent md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-base italic leading-relaxed text-parchment-300 md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
