import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border-gold-600 bg-leather-800 text-gold-400 hover:bg-leather-700 hover:text-gold-300",
  secondary:
    "border-iron-700 bg-iron-800 text-parchment-200 hover:border-gold-600 hover:bg-iron-700",
  danger:
    "border-blood-600 bg-blood-600/10 text-blood-600 hover:bg-blood-600 hover:text-parchment-200",
};

export default function ThemedLinkButton({
  href,
  children,
  icon,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 border-2 px-5 py-3 font-serif tracking-wider transition ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </Link>
  );
}
