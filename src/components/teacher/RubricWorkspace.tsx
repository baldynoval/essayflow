'use client';

import { Plus, RefreshCcw, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { totalWeight } from '@/lib/scoring';
import type { RubricCriterion } from '@/types/domain';
import { cn } from '@/lib/cn';

const PRESETS = [
  { id: 'seimbang', label: 'Seimbang' },
  { id: 'analisis', label: 'Fokus analisis' },
  { id: 'bahasa', label: 'Fokus bahasa akademik' },
  { id: 'kode', label: 'Tugas pemrograman' },
] as const;

const STARTER: RubricCriterion[] = [
  { id: 'rb-1', name: 'Kesesuaian dengan Topik', weight: 30, description: '' },
  { id: 'rb-2', name: 'Struktur Argumentasi', weight: 25, description: '' },
  { id: 'rb-3', name: 'Kedalaman Analisis', weight: 25, description: '' },
  { id: 'rb-4', name: 'Penggunaan Bahasa', weight: 20, description: '' },
];

export function RubricWorkspace({ taskTitle }: { taskTitle: string }) {
  const [criteria, setCriteria] = useState<RubricCriterion[]>(STARTER);
  const [suggestions, setSuggestions] = useState<RubricCriterion[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [preset, setPreset] = useState<string>('seimbang');
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const weight = totalWeight(criteria);

  async function generate() {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch('/api/ai/rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, instructions: '', preset, instruction }),
      });
      if (!response.ok) throw new Error('gagal');
      const data = (await response.json()) as { criteria: RubricCriterion[]; note: string };
      setSuggestions(data.criteria);
      setNote(data.note);
    } catch {
      setError('AI gagal menyusun rubrik. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  function apply(criterion: RubricCriterion) {
    setCriteria((current) =>
      current.some((item) => item.name === criterion.name) ? current : [...current, { ...criterion, id: `${criterion.id}-${Date.now()}` }],
    );
  }

  function applyAll() {
    setCriteria(suggestions.map((criterion) => ({ ...criterion })));
  }

  function update(id: string, patch: Partial<RubricCriterion>) {
    setCriteria((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-body font-medium text-ink">Rubrik Penilaian</h2>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Plus className="size-4" aria-hidden />}
            onClick={() =>
              setCriteria((current) => [
                ...current,
                { id: `rb-${current.length + 1}-${Date.now()}`, name: '', weight: 0, description: '' },
              ])
            }
          >
            Tambah Kriteria
          </Button>
        </div>

        <ul className="mt-6 flex flex-col gap-4">
          {criteria.map((criterion) => (
            <li key={criterion.id} className="rounded-sm border border-line p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <Input
                  containerClassName="flex-1"
                  label="Nama kriteria"
                  value={criterion.name}
                  onChange={(event) => update(criterion.id, { name: event.target.value })}
                />
                <Input
                  containerClassName="sm:w-1/3"
                  label="Bobot (%)"
                  type="number"
                  min={0}
                  max={100}
                  value={String(criterion.weight)}
                  onChange={(event) => update(criterion.id, { weight: Number(event.target.value) })}
                />
                <Button
                  variant="ghost"
                  aria-label={`Hapus ${criterion.name || 'kriteria'}`}
                  onClick={() => setCriteria((current) => current.filter((item) => item.id !== criterion.id))}
                  iconLeft={<Trash2 className="size-4" aria-hidden />}
                />
              </div>
              <Textarea
                containerClassName="mt-4"
                label="Deskripsi"
                rows={2}
                value={criterion.description ?? ''}
                onChange={(event) => update(criterion.id, { description: event.target.value })}
              />
            </li>
          ))}
        </ul>

        <p className={cn('mt-6 flex items-center justify-between border-t border-line pt-4 text-meta', weight === 100 ? 'text-ink-2' : 'text-danger')}>
          <span>Total</span>
          <span className="font-medium tabular-nums">{weight}%</span>
        </p>

        {saved && (
          <Alert tone="success" className="mt-4">
            Rubrik disimpan dan siap dipakai pada formulir tugas.
          </Alert>
        )}

        <Button
          className="mt-6"
          fullWidth
          size="lg"
          disabled={weight !== 100}
          onClick={() => setSaved(true)}
        >
          Simpan Rubrik
        </Button>
        {weight !== 100 && <p className="mt-2 text-meta text-danger">Total bobot harus 100% sebelum rubrik disimpan.</p>}
      </Card>

      <Card className="h-fit">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-3 text-body font-medium text-ink">
            <AIIndicator label="AI EssayFlow" />
          </h2>
          <Button
            variant="secondary"
            size="sm"
            loading={loading}
            onClick={generate}
            iconLeft={<RefreshCcw className="size-4" aria-hidden />}
          >
            Buat Ulang
          </Button>
        </div>

        <fieldset className="mt-6">
          <legend className="text-meta font-medium text-ink">Instruksi preset</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreset(item.id)}
                aria-pressed={preset === item.id}
                className={cn(
                  'inline-flex h-8 items-center rounded-full border px-3 text-caption transition-colors duration-200 motion-reduce:transition-none',
                  preset === item.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-ink/20',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <Textarea
          containerClassName="mt-6"
          label="Instruksi tambahan untuk AI"
          rows={3}
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          placeholder="Contoh: tekankan penggunaan rujukan ilmiah dan contoh implementasi."
        />

        <Button
          className="mt-4"
          fullWidth
          loading={loading}
          onClick={generate}
          iconLeft={<Sparkles className="size-4" aria-hidden />}
        >
          Buat Saran Rubrik
        </Button>

        {error && (
          <Alert tone="danger" className="mt-4" action={<Button size="sm" variant="secondary" onClick={generate}>Coba Lagi</Button>}>
            {error}
          </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6 border-t border-line pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-meta font-medium text-ink">Saran Rubrik dari AI</p>
              <Button variant="secondary" size="sm" onClick={applyAll}>
                Terapkan Semua
              </Button>
            </div>
            {note && <p className="mt-2 text-caption text-ink-2">{note}</p>}
            <ul className="mt-4 flex flex-col gap-3">
              {suggestions.map((criterion) => (
                <li key={criterion.id} className="flex items-start justify-between gap-4 rounded-sm border border-accent-line bg-accent-soft/40 p-4">
                  <div className="min-w-0">
                    <p className="text-meta font-medium text-ink">
                      {criterion.name} — {criterion.weight}%
                    </p>
                    {criterion.description && <p className="mt-1 text-caption text-ink-2">{criterion.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => apply(criterion)}>
                    Terapkan
                  </Button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption text-ink-2">
              Hasil AI bersifat draf dan tetap dapat diubah secara manual sebelum disimpan.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
