"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useAutoFocusFirstError(
  fieldErrors?: Partial<Record<string, string>>,
  status?: "idle" | "success" | "error",
  scopeRef?: RefObject<HTMLElement | HTMLFormElement | null>,
) {
  useEffect(() => {
    if (status !== "error" || !fieldErrors) return;

    const firstField = Object.keys(fieldErrors).find((key) => fieldErrors[key]);
    if (!firstField) return;

    const selector = `[data-field-name="${firstField}"]`;
    const root = scopeRef?.current ?? document;
    const element = root.querySelector<HTMLElement>(selector);
    element?.focus();
  }, [fieldErrors, scopeRef, status]);
}
