import type { ReactNode } from "react";

export default function ParchmentCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`bg-parchment border-4 border-iron-800 shadow-[0_0_40px_rgba(0,0,0,0.35)] ${className}`}>{children}</div>;
}
