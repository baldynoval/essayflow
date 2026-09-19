import { clsx, type ClassValue } from 'clsx';

/** Class-name helper. (tailwind-merge is intentionally not used: custom font-size tokens confuse it.) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
