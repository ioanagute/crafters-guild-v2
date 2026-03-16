import type { ReactNode } from "react";

export default function FormMessage({
  tone,
  role,
  children,
}: {
  tone: "error" | "success";
  role?: "alert" | "status";
  children: ReactNode;
}) {
  const classes =
    tone === "error"
      ? "border-blood-600 bg-blood-600/12 text-blood-700"
      : "border-gold-600/70 bg-gold-500/12 text-ink-900";

  return (
    <div role={role} className={`rounded-[1rem] border px-4 py-3 text-sm leading-relaxed shadow-[0_10px_22px_rgba(0,0,0,0.08)] ${classes}`}>
      {children}
    </div>
  );
}
