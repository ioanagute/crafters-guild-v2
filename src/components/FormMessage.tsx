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
      ? "border-blood-600 bg-blood-600/10 text-blood-700"
      : "border-gold-600 bg-gold-500/10 text-ink-900";

  return (
    <div role={role} className={`rounded-sm border px-4 py-3 text-sm ${classes}`}>
      {children}
    </div>
  );
}
