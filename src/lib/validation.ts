const HTTPS_PROTOCOL = "https:";

export function validateLength(
  value: string,
  options: {
    min?: number;
    max: number;
  },
) {
  const length = value.length;

  if (options.min !== undefined && length < options.min) {
    return false;
  }

  return length <= options.max;
}

export function validateNumberRange(
  value: number,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  },
) {
  if (!Number.isFinite(value)) return false;
  if (options.integer && !Number.isInteger(value)) return false;
  if (options.min !== undefined && value < options.min) return false;
  if (options.max !== undefined && value > options.max) return false;
  return true;
}

export function validateHttpsUrl(value: string | null) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === HTTPS_PROTOCOL;
  } catch {
    return false;
  }
}

export function validateUuid(value: string | null) {
  if (!value) return true;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
