import type { ReactNode } from "react";

type StateTone = "empty" | "error" | "info";

const toneClasses: Record<StateTone, string> = {
  empty: "border-iron-700 bg-iron-800/70 text-parchment-300",
  error: "border-blood-600 bg-blood-600/10 text-parchment-300",
  info: "border-gold-600/70 bg-iron-800/70 text-parchment-300",
};

export default function StatePanel({
  title,
  description,
  tone = "info",
  icon,
  actions,
}: {
  title: string;
  description: string;
  tone?: StateTone;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className={`border p-8 text-center shadow-2xl ${toneClasses[tone]}`}>
      {icon ? <div className="mb-4 flex justify-center">{icon}</div> : null}
      <h2 className="font-serif text-3xl text-parchment-200">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed">{description}</p>
      {actions ? <div className="mt-6 flex justify-center gap-3">{actions}</div> : null}
    </section>
  );
}
