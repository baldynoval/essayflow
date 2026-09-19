/**
 * Mock account repository for Module 02.
 * Replace with a real repository (Prisma/Drizzle/HTTP) without touching the AuthService contract.
 * Passwords are demo-only plaintext; a real implementation must hash + compare server-side.
 */

import type { AuthUser } from '@/types/auth';

export interface StoredUser extends AuthUser {
  password: string;
}

export const MOCK_USERS: StoredUser[] = [
  {
    id: 'usr-pengajar-01',
    name: 'Dr. Budi Santoso',
    email: 'budi.santoso@kampus.ac.id',
    role: 'pengajar',
    identityNumber: 'NIP 198203142008011003',
    password: 'essayflow2026',
    provider: 'password',
    profileComplete: true,
  },
  {
    id: 'usr-pengajar-02',
    name: 'Dr. Sari Wulandari',
    email: 'sari.wulandari@kampus.ac.id',
    role: 'pengajar',
    identityNumber: 'NIP 198711202012122001',
    password: 'essayflow2026',
    provider: 'password',
    profileComplete: true,
  },
  {
    id: 'usr-mahasiswa-01',
    name: 'Andi Pratama',
    email: 'andi.pratama@student.kampus.ac.id',
    role: 'mahasiswa',
    identityNumber: '26231001',
    password: 'essayflow2026',
    provider: 'password',
    profileComplete: true,
  },
  {
    id: 'usr-mahasiswa-02',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@student.kampus.ac.id',
    role: 'mahasiswa',
    identityNumber: '26231002',
    password: 'essayflow2026',
    provider: 'password',
    profileComplete: true,
  },
];

/** Shown on the login page so the module is testable without a database. */
export const DEMO_ACCOUNTS = [
  { role: 'pengajar' as const, email: 'budi.santoso@kampus.ac.id', password: 'essayflow2026' },
  { role: 'mahasiswa' as const, email: 'andi.pratama@student.kampus.ac.id', password: 'essayflow2026' },
];

export function findUserByEmail(email: string): StoredUser | undefined {
  const needle = email.trim().toLowerCase();
  return MOCK_USERS.find((user) => user.email.toLowerCase() === needle);
}
