/** Form validation shared by the client form and the API route (never trust the client alone). */

import type { Role } from '@/types/domain';

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FieldName = 'email' | 'password';
export type FieldErrors = Partial<Record<FieldName, string>>;

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return 'Email wajib diisi.';
  if (!EMAIL_PATTERN.test(email)) return 'Format email tidak valid.';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password wajib diisi.';
  if (value.length < PASSWORD_MIN_LENGTH) return `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`;
  return undefined;
}

export function validateCredentials(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  if (email) errors.email = email;
  if (password) errors.password = password;
  return errors;
}

export function isRole(value: unknown): value is Role {
  return value === 'pengajar' || value === 'mahasiswa';
}
