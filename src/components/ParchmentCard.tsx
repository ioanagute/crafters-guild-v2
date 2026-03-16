import type { ReactNode } from "react";
import DecorativeCorners from "./DecorativeCorners";

export default function ParchmentCard({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "inset";
}) {
  const variants = {
    default: "border-[1.5px] border-iron-900/90 rounded-[1.35rem]",
    elevated: "border-[1.5px] border-iron-900/90 rounded-[1.5rem] surface-interactive",
    inset: "border border-leather-800/60 rounded-[1.2rem] shadow-[inset_0_0_35px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.18)]",
  } as const;

  return (
    <div className={`bg-parchment relative overflow-hidden ${variants[variant]} ${className}`}>
      {/* Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      
      {/* Decorative Corners */}
      <DecorativeCorners size={28} className="opacity-40 text-leather-800" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
