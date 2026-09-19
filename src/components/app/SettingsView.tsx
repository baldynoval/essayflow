'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { PASSWORD_MIN_LENGTH } from '@/lib/auth/validation';
import type { Role } from '@/types/domain';
import { cn } from '@/lib/cn';

const NOTIFICATIONS = [
  { id: 'tugas-baru', label: 'Tugas baru', roles: ['mahasiswa'] },
  { id: 'deadline', label: 'Deadline', roles: ['pengajar', 'mahasiswa'] },
  { id: 'pengumpulan', label: 'Pengumpulan mahasiswa', roles: ['pengajar'] },
  { id: 'ai-selesai', label: 'Hasil AI selesai', roles: ['pengajar', 'mahasiswa'] },
  { id: 'menunggu-review', label: 'Menunggu review', roles: ['pengajar'] },
  { id: 'hasil-dirilis', label: 'Hasil dirilis', roles: ['mahasiswa'] },
] as const;

export interface SettingsViewProps {
  role: Role;
  name: string;
  email: string;
  identityNumber: string;
}

export function SettingsView({ role, name, email, identityNumber }: SettingsViewProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(name);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [channels, setChannels] = useState<Record<string, { app: boolean; email: boolean }>>(() =>
    Object.fromEntries(NOTIFICATIONS.map((item) => [item.id, { app: true, email: false }])),
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('essayflow-theme');
      if (stored === 'dark' || stored === 'light') applyTheme(stored);
    } catch {
      // Penyimpanan lokal tidak tersedia — tema tetap terang.
    }
  }, []);

  function applyTheme(next: 'light' | 'dark') {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem('essayflow-theme', next);
    } catch {
      // Diabaikan: preferensi tema tidak dapat disimpan di perangkat ini.
    }
  }

  function savePassword() {
    setPasswordError(null);
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return setPasswordError(`Password baru minimal ${PASSWORD_MIN_LENGTH} karakter.`);
    }
    if (newPassword !== confirmPassword) {
      return setPasswordError('Konfirmasi password tidak sama dengan password baru.');
    }
    if (!currentPassword) return setPasswordError('Masukkan password Anda saat ini.');
    setSaved('Password berhasil diperbarui.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const visible = NOTIFICATIONS.filter((item) => (item.roles as readonly string[]).includes(role));

  return (
    <div className="flex flex-col gap-6">
      {saved && <Alert tone="success">{saved}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <h2 className="text-body font-medium text-ink">Profil</h2>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Avatar name={displayName} size="lg" />
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">
                  Unggah Foto
                </Button>
                <Button variant="ghost" size="sm">
                  Hapus
                </Button>
              </div>
              <Badge tone="accent" className="ml-auto">
                {role === 'pengajar' ? 'Pengajar' : 'Mahasiswa'}
              </Badge>
            </div>
            <p className="mt-3 text-caption text-ink-2">
              Tanpa foto, EssayFlow menampilkan inisial nama Anda.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input label="Nama Lengkap" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
              <Input label="Email" type="email" value={email} readOnly hint="Email tidak dapat diubah dari halaman ini." />
              <Input
                label={role === 'mahasiswa' ? 'NIM' : 'NIP'}
                value={identityNumber}
                readOnly
                disabled={role === 'mahasiswa'}
                hint={role === 'mahasiswa' ? 'NIM hanya dapat diubah oleh administrator.' : undefined}
              />
              <Input label="Peran" value={role === 'pengajar' ? 'Pengajar' : 'Mahasiswa'} readOnly />
            </div>
            <Button className="mt-6" onClick={() => setSaved('Profil berhasil disimpan.')}>
              Simpan Profil
            </Button>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Keamanan</h2>
            {passwordError && (
              <Alert tone="danger" className="mt-4">
                {passwordError}
              </Alert>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <Input
                label="Password saat ini"
                type="password"
                revealable
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
              <Input
                label="Password baru"
                type="password"
                revealable
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
              />
              <Input
                label="Konfirmasi password"
                type="password"
                revealable
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            <Button className="mt-6" variant="secondary" onClick={savePassword}>
              Ubah Password
            </Button>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Notifikasi</h2>
            <p className="mt-2 text-meta text-ink-2">Atur kanal untuk setiap jenis pemberitahuan.</p>
            <ul className="mt-6 flex flex-col gap-4">
              {visible.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0">
                  <span className="text-body-sm text-ink">{item.label}</span>
                  <span className="flex gap-6">
                    {(['app', 'email'] as const).map((channel) => (
                      <label key={channel} className="inline-flex cursor-pointer items-center gap-2 text-meta text-ink-2">
                        <input
                          type="checkbox"
                          checked={channels[item.id][channel]}
                          onChange={(event) =>
                            setChannels((current) => ({
                              ...current,
                              [item.id]: { ...current[item.id], [channel]: event.target.checked },
                            }))
                          }
                          className="size-4 accent-accent"
                        />
                        {channel === 'app' ? 'App' : 'Email'}
                      </label>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-body font-medium text-ink">Preferensi</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div role="radiogroup" aria-label="Tema tampilan" className="flex gap-1 rounded-sm bg-muted p-1">
                {(['light', 'dark'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={theme === option}
                    onClick={() => applyTheme(option)}
                    className={cn(
                      'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm text-body-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
                      theme === option ? 'bg-bg text-ink shadow-soft' : 'text-ink-2 hover:text-ink',
                    )}
                  >
                    {option === 'light' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
                    {option === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
              <Select label="Bahasa" defaultValue="id">
                <option value="id">Bahasa Indonesia</option>
              </Select>
              <Toggle
                checked
                onChange={() => undefined}
                label="Kurangi animasi"
                description="Mengikuti pengaturan sistem perangkat Anda."
                disabled
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Dukungan</h2>
            <ul className="mt-6 flex flex-col gap-3 text-body-sm">
              <li>
                <Link href="/faq" className="rounded-sm text-ink-2 hover:text-ink">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/bantuan" className="rounded-sm text-ink-2 hover:text-ink">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="rounded-sm text-ink-2 hover:text-ink">
                  Kontak
                </Link>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Akun</h2>
            <Button className="mt-6" variant="secondary" fullWidth onClick={logout}>
              Logout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
