/**
 * Normalize a North America–style phone string to E.164 (+1XXXXXXXXXX).
 * Returns null when the input cannot be turned into a valid mobile destination.
 */
export function toE164PhoneNumber(rawPhone: string): string | null {
  const trimmed = rawPhone.trim();

  if (!trimmed) {
    return null;
  }

  const hasPlusPrefix = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (hasPlusPrefix) {
    if (digits.length < 10 || digits.length > 15) {
      return null;
    }

    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}
