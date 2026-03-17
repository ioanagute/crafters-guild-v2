import WaxSeal from "./WaxSeal";

export default function StatPill({
  label,
  value,
  emphasis = "default",
}: {
  label: string;
  value: string | number;
  emphasis?: "default" | "soft";
}) {
  return (
    <div className={`relative min-w-[9rem] overflow-hidden rounded-[1.1rem] border px-5 py-4 shadow-[0_18px_30px_rgba(0,0,0,0.22)] ${emphasis === "soft" ? "border-iron-700 bg-iron-800/72" : "border-gold-600/60 bg-iron-800/86"}`}>
      {/* Subtle metallic reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative z-10 flex flex-col">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-parchment-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="font-serif text-3xl leading-none text-gold-accent">{value}</p>
          </div>
        </div>
        <WaxSeal className="shrink-0 scale-75 opacity-80" color={emphasis === "soft" ? "#4a332a" : "#8a0303"} />
      </div>
    </div>
  );
}
