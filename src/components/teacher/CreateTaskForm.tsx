'use client';

import { Plus, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { totalWeight } from '@/lib/scoring';
import type { ClassRoom, LatePolicy, RubricCriterion, SubmissionType } from '@/types/domain';
import { cn } from '@/lib/cn';

const SUBMISSION_TYPES: { value: SubmissionType; label: string }[] = [
  { value: 'teks', label: 'Teks' },
  { value: 'kode', label: 'Kode' },
  { value: 'pdf', label: 'PDF' },
  { value: 'word', label: 'Word' },
];

const LATE_POLICIES: { value: LatePolicy; label: string; hint: string }[] = [
  { value: 'tidak-diizinkan', label: 'Tidak diizinkan', hint: 'Pengumpulan ditolak setelah tenggat.' },
  { value: 'sampai-tugas-ditutup', label: 'Diizinkan sampai tugas ditutup', hint: 'Ditandai Terlambat.' },
  { value: 'maksimal-keterlambatan', label: 'Diizinkan sampai batas keterlambatan', hint: 'Tentukan batas dalam jam.' },
];

const emptyCriterion = (index: number): RubricCriterion => ({
  id: `kriteria-${index}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  weight: 0,
  description: '',
});

export interface CreateTaskFormProps {
  classes: ClassRoom[];
  /** Rubric carried back from the AI workspace, if any. */
  initialRubric?: RubricCriterion[];
}

export function CreateTaskForm({ classes, initialRubric }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [deadlineDate, setDeadlineDate] = useState('2026-09-20');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [types, setTypes] = useState<SubmissionType[]>(['teks']);
  const [latePolicy, setLatePolicy] = useState<LatePolicy>('tidak-diizinkan');
  const [maxLateHours, setMaxLateHours] = useState('24');
  const [maxFileSizeMb, setMaxFileSizeMb] = useState('10');
  const [allowRevision, setAllowRevision] = useState(false);
  const [maxRevisions, setMaxRevisions] = useState('1');
  const [aiGrading, setAiGrading] = useState(true);
  const [aiReEvaluate, setAiReEvaluate] = useState(true);
  const [criteria, setCriteria] = useState<RubricCriterion[]>(
    initialRubric ?? [
      { id: 'kriteria-1', name: 'Kesesuaian dengan Topik', weight: 30, description: '' },
      { id: 'kriteria-2', name: 'Struktur Argumentasi', weight: 25, description: '' },
      { id: 'kriteria-3', name: 'Kedalaman Analisis', weight: 25, description: '' },
      { id: 'kriteria-4', name: 'Penggunaan Bahasa', weight: 20, description: '' },
    ],
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<'draft' | 'aktif' | null>(null);
  const [busy, setBusy] = useState(false);

  const weight = useMemo(() => totalWeight(criteria), [criteria]);
  const weightValid = weight === 100;

  function toggleType(type: SubmissionType) {
    setTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  function updateCriterion(id: string, patch: Partial<RubricCriterion>) {
    setCriteria((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function submit(event: FormEvent<HTMLFormElement>, status: 'draft' | 'aktif') {
    event.preventDefault();
    setError(null);
    setSaved(null);

    if (!title.trim()) return setError('Judul tugas wajib diisi.');
    if (!classId) return setError('Pilih kelas untuk tugas ini.');
    if (types.length === 0) return setError('Pilih minimal satu jenis pengumpulan.');
    if (status === 'aktif' && !weightValid) {
      return setError(`Total bobot rubrik harus 100%. Saat ini ${weight}%.`);
    }

    setBusy(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          instructions,
          classId,
          deadline: `${deadlineDate}T${deadlineTime}:00+07:00`,
          status,
          rubric: criteria,
          settings: {
            submissionTypes: types,
            latePolicy,
            maxLateHours: Number(maxLateHours),
            maxFileSizeMb: Number(maxFileSizeMb),
            allowRevision,
            maxRevisions: Number(maxRevisions),
            aiGrading,
            aiReEvaluateRevisions: aiReEvaluate,
          },
        }),
      });
      if (!response.ok) throw new Error('gagal');
      setSaved(status);
    } catch {
      setError('Terjadi kesalahan saat menyimpan. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => submit(event, 'aktif')} className="flex flex-col gap-6">
      {error && <Alert tone="danger">{error}</Alert>}
      {saved && (
        <Alert tone="success" title={saved === 'draft' ? 'Tugas disimpan sebagai draft.' : 'Tugas berhasil dibuat.'}>
          Data disimpan melalui layanan mock — akan tersimpan permanen setelah basis data terhubung.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <h2 className="text-body font-medium text-ink">Informasi Tugas</h2>
            <div className="mt-6 flex flex-col gap-5">
              <Input
                label="Judul Tugas"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Analisis Algoritma Pencarian"
                required
              />
              <Textarea
                label="Deskripsi / Instruksi"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder="Jelaskan algoritma pencarian yang telah dipelajari…"
                rows={6}
              />
              <Select label="Kelas" value={classId} onChange={(event) => setClassId(event.target.value)}>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.code}
                  </option>
                ))}
              </Select>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Tanggal Deadline"
                  type="date"
                  value={deadlineDate}
                  onChange={(event) => setDeadlineDate(event.target.value)}
                />
                <Input
                  label="Waktu Deadline"
                  type="time"
                  value={deadlineTime}
                  onChange={(event) => setDeadlineTime(event.target.value)}
                  hint="Zona waktu WIB"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Pengumpulan</h2>
            <fieldset className="mt-6">
              <legend className="text-meta font-medium text-ink">Jenis pengumpulan</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUBMISSION_TYPES.map((type) => {
                  const checked = types.includes(type.value);
                  return (
                    <label
                      key={type.value}
                      className={cn(
                        'inline-flex h-10 cursor-pointer items-center gap-2 rounded-sm border px-4 text-body-sm transition-colors duration-200 motion-reduce:transition-none',
                        checked ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-ink/20',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleType(type.value)}
                        className="size-4 accent-accent"
                      />
                      {type.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Select
                label="Kebijakan keterlambatan"
                value={latePolicy}
                onChange={(event) => setLatePolicy(event.target.value as LatePolicy)}
                hint={LATE_POLICIES.find((item) => item.value === latePolicy)?.hint}
              >
                {LATE_POLICIES.map((policy) => (
                  <option key={policy.value} value={policy.value}>
                    {policy.label}
                  </option>
                ))}
              </Select>
              {latePolicy === 'maksimal-keterlambatan' && (
                <Input
                  label="Batas keterlambatan (jam)"
                  type="number"
                  min={1}
                  value={maxLateHours}
                  onChange={(event) => setMaxLateHours(event.target.value)}
                />
              )}
              <Input
                label="Ukuran maksimum berkas (MB)"
                type="number"
                min={1}
                value={maxFileSizeMb}
                onChange={(event) => setMaxFileSizeMb(event.target.value)}
              />
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-body font-medium text-ink">Rubrik Penilaian</h2>
              <div className="flex items-center gap-3">
                <Button
                  href="/teacher/tasks/create/rubric"
                  variant="secondary"
                  size="sm"
                  iconLeft={<Sparkles className="size-4" aria-hidden />}
                >
                  Buat dengan AI
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeft={<Plus className="size-4" aria-hidden />}
                  onClick={() => setCriteria((current) => [...current, emptyCriterion(current.length + 1)])}
                >
                  Tambah Kriteria
                </Button>
              </div>
            </div>

            <ul className="mt-6 flex flex-col gap-4">
              {criteria.map((criterion) => (
                <li key={criterion.id} className="rounded-sm border border-line p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <Input
                      containerClassName="flex-1"
                      label="Nama kriteria"
                      value={criterion.name}
                      onChange={(event) => updateCriterion(criterion.id, { name: event.target.value })}
                      placeholder="Kesesuaian dengan Topik"
                    />
                    <Input
                      containerClassName="sm:w-1/4"
                      label="Bobot (%)"
                      type="number"
                      min={0}
                      max={100}
                      value={String(criterion.weight)}
                      onChange={(event) => updateCriterion(criterion.id, { weight: Number(event.target.value) })}
                    />
                    <Button
                      variant="ghost"
                      size="md"
                      aria-label={`Hapus kriteria ${criterion.name || 'tanpa nama'}`}
                      onClick={() => setCriteria((current) => current.filter((item) => item.id !== criterion.id))}
                      iconLeft={<Trash2 className="size-4" aria-hidden />}
                    />
                  </div>
                  <Textarea
                    containerClassName="mt-4"
                    label="Deskripsi"
                    rows={2}
                    value={criterion.description ?? ''}
                    onChange={(event) => updateCriterion(criterion.id, { description: event.target.value })}
                    placeholder="Apa yang dinilai pada kriteria ini?"
                  />
                </li>
              ))}
            </ul>

            <p
              className={cn(
                'mt-6 flex items-center justify-between border-t border-line pt-4 text-meta',
                weightValid ? 'text-ink-2' : 'text-danger',
              )}
            >
              <span>Total bobot</span>
              <span className="font-medium tabular-nums">{weight}%</span>
            </p>
            {!weightValid && (
              <p className="mt-2 text-meta text-danger">Total bobot rubrik harus tepat 100% sebelum tugas diaktifkan.</p>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-body font-medium text-ink">Pengaturan</h2>
            <div className="mt-6 flex flex-col gap-6">
              <Toggle
                checked={allowRevision}
                onChange={setAllowRevision}
                label="Izinkan Revisi"
                description="Mahasiswa dapat mengumpulkan versi perbaikan."
              />
              {allowRevision && (
                <Input
                  label="Maksimum revisi"
                  type="number"
                  min={1}
                  value={maxRevisions}
                  onChange={(event) => setMaxRevisions(event.target.value)}
                />
              )}
              <Toggle
                checked={aiGrading}
                onChange={setAiGrading}
                label="Penilaian AI"
                description="AI menyusun draf nilai dan feedback. Pengajar tetap pengambil keputusan akhir."
              />
              {aiGrading && allowRevision && (
                <Toggle
                  checked={aiReEvaluate}
                  onChange={setAiReEvaluate}
                  label="Nilai ulang setiap revisi"
                  description="Bila dimatikan, pengajar memilih penilaian manual atau AI untuk revisi."
                />
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Tindakan</h2>
            <div className="mt-6 flex flex-col gap-3">
              <Button type="submit" size="lg" fullWidth loading={busy}>
                Buat Tugas
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                disabled={busy}
                onClick={(event) => submit(event as unknown as FormEvent<HTMLFormElement>, 'draft')}
              >
                Simpan sebagai Draft
              </Button>
              <Link href="/teacher/tasks" className="text-center text-meta text-ink-2 hover:text-ink">
                Batal
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
