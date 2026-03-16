"use client";

import type { ReactNode } from "react";

export default function PendingButton({
  type = "submit",
  pending,
  idleLabel,
  pendingLabel,
  icon,
  className,
  disabled,
  ariaLabel,
  onClick,
}: {
  type?: "button" | "submit";
  pending?: boolean;
  idleLabel: ReactNode;
  pendingLabel: ReactNode;
  icon?: ReactNode;
  className: string;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const isDisabled = disabled || pending;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={pending}
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
    >
      {icon}
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
