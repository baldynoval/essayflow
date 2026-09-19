import type { Metadata } from 'next';
import { SettingsView } from '@/components/app/SettingsView';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireSession } from '@/lib/auth/guard';
import { getCurrentStudent, getTeacher } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Pengaturan — EssayFlow' };

export default async function SettingsPage() {
  const session = await requireSession('/settings');
  const identityNumber =
    session.role === 'pengajar' ? (await getTeacher()).identityNumber : (await getCurrentStudent()).nim;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={session.role === 'pengajar' ? 'Pengaturan' : 'Profil'}
        description="Kelola profil, keamanan akun, notifikasi, dan preferensi tampilan."
      />
      <SettingsView role={session.role} name={session.name} email={session.email} identityNumber={identityNumber} />
    </div>
  );
}
