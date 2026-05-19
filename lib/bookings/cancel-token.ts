import "server-only";

export const CANCEL_TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export function generateCancelToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function isCancelToken(value: string): boolean {
  return CANCEL_TOKEN_PATTERN.test(value);
}
