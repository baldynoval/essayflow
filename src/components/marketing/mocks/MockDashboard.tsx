import { StatusBadge } from '@/components/ui/StatusBadge';
import { buttonClasses } from '@/components/ui/Button';
import { MockWindow } from './MockWindow';

const STATS = [
  { label: 'Tugas Aktif', value: '12' },
  { label: 'Menunggu Review', value: '8' },
  { label: 'Sudah Dinilai', value: '34' },
  { label: 'Mahasiswa', value: '126' },
];

const TASKS = [
  { title: 'Analisis Algoritma Pencarian', course: 'Pemrograman Dasar', due: '25 September 2026' },
  { title: 'Struktur Data dan Linked List', course: 'Algoritma dan Struktur Data', due: '28 September 2026' },
  { title: 'Normalisasi Basis Data', course: 'Basis Data', due: '30 September 2026' },
];

const ACTIVITY = [
  'Mahasiswa mengumpulkan tugas',
  'AI selesai menganalisis 5 tugas',
  'Tugas “Normalisasi Basis Data” dibuat',
];

/** Teacher dashboard, condensed. */
export function MockDashboard() {
  return (
    <MockWindow title="Dasbor · Pengajar">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-body-sm font-semibold">Selamat datang kembali, Dr. Budi Santoso</p>
          <span className={buttonClasses({ variant: 'primary', size: 'sm', className: 'hidden sm:inline-flex' })}>Buat Tugas</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-sm border border-line p-4">
              <p className="text-sub tabular-nums">{s.value}</p>
              <p className="mt-1 text-caption text-ink-2">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-sm border border-line">
            <p className="border-b border-line px-4 py-3 text-meta font-semibold">Tugas Terbaru</p>
            <ul className="divide-y divide-line">
              {TASKS.map((t) => (
                <li key={t.title} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-meta font-medium">{t.title}</p>
                    <p className="truncate text-caption text-ink-2">
                      {t.course} · {t.due}
                    </p>
                  </div>
                  <StatusBadge status="active" />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-line">
            <p className="border-b border-line px-4 py-3 text-meta font-semibold">Aktivitas Terbaru</p>
            <ul className="divide-y divide-line">
              {ACTIVITY.map((a) => (
                <li key={a} className="px-4 py-3 text-caption text-ink-2">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
