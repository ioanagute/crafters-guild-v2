"use client";

import type { ReactNode } from "react";

export default function FormField({
  label,
  htmlFor,
  helpText,
  error,
  helpTextId,
  className = "flex flex-col gap-2",
  labelClassName = "font-serif text-ink-900 font-bold uppercase tracking-[0.28em] text-[0.68rem]",
  children,
}: {
  label: string;
  htmlFor: string;
  helpText?: ReactNode;
  error?: ReactNode;
  helpTextId?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      {children}
      {error}
      {helpText ? (
        <p
          id={helpTextId}
          className="text-xs leading-relaxed text-leather-700 italic"
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
