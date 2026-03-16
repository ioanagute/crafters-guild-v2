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
  align = "center",
}: {
  title: string;
  description: string;
  tone?: StateTone;
  icon?: ReactNode;
  actions?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <section className={`overflow-hidden rounded-[1.35rem] border p-8 shadow-[0_24px_50px_rgba(0,0,0,0.2)] ${toneClasses[tone]} ${align === "left" ? "text-left" : "text-center"}`}>
      <div className={`flex ${align === "left" ? "justify-start" : "justify-center"}`}>
        {icon ? <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/10">{icon}</div> : null}
      </div>
      <h2 className="font-serif text-3xl text-parchment-200">{title}</h2>
      <p className={`${align === "left" ? "mt-3 max-w-2xl" : "mx-auto mt-3 max-w-2xl"} text-sm leading-relaxed`}>{description}</p>
      {actions ? <div className={`mt-6 flex flex-wrap gap-3 ${align === "left" ? "justify-start" : "justify-center"}`}>{actions}</div> : null}
    </section>
  );
}
