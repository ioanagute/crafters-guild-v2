export default function StatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-gold-600/80 bg-iron-800/80 px-5 py-4 text-center shadow-2xl">
      <p className="text-xs uppercase tracking-[0.25em] text-parchment-400">{label}</p>
      <p className="mt-2 font-serif text-3xl text-gold-400">{value}</p>
    </div>
  );
}
