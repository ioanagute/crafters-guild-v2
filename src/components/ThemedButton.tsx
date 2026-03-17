import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "border-gold-600/80 bg-leather-800 text-gold-300 hover:border-gold-500 hover:bg-leather-700 hover:text-gold-200",
  secondary:
    "border-iron-700 bg-iron-800/90 text-parchment-100 hover:border-gold-600/80 hover:bg-iron-700",
  danger:
    "border-blood-600 bg-blood-600/10 text-blood-600 hover:bg-blood-600 hover:text-parchment-200",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-[0.95rem]",
};

export default function ThemedButton({
  children,
  icon,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[0.95rem] border font-serif tracking-[0.16em] uppercase shadow-[0_14px_30px_rgba(0,0,0,0.2)] transition active:scale-[0.98] active:shadow-inner focus-visible:outline-none disabled:opacity-70 disabled:cursor-not-allowed ${sizes[size]} ${fullWidth ? "w-full" : ""} ${variants[variant]} ${className}`}
    >
      {/* Sheen effect on hover */}
      <div className="absolute inset-x-0 inset-y-0 h-full w-12 -translate-x-full rotate-25 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sheen" />

      {/* Texture mask */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay" />

      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}
