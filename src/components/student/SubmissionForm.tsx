'use client';

import { FileText, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { SubmissionType, TaskSettings } from '@/types/domain';
import { cn } from '@/lib/cn';

const TYPE_LABEL: Record<SubmissionType, string> = { teks: 'Teks', kode: 'Kode', pdf: 'PDF', word: 'Word' };
const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go'];

export interface SubmissionFormProps {
  taskId: string;
  settings: TaskSettings;
  /** Melewati tenggat dan kebijakan melarang keterlambatan. */
  locked: boolean;
  lockReason?: string;
}

export function SubmissionForm({ taskId, settings, locked, lockReason }: SubmissionFormProps) {
  const router = useRouter();
  const types = settings.submissionTypes;
  const [type, setType] = useState<SubmissionType>(types[0]);
  const [text, setText] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [file, setFile] = useState<{ name: string; sizeKb: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const isFileType = type === 'pdf' || type === 'word';
  const lineNumbers = useMemo(() => code.split('\n').map((_, index) => index + 1), [code]);

  const ready = isFileType ? Boolean(file) : (type === 'kode' ? code.trim() : text.trim()).length > 0;

  function pickFile(selected: File | undefined) {
    setUploadError(null);
    if (!selected) return;
    const sizeKb = Math.round(selected.size / 1024);
    if (sizeKb > settings.maxFileSizeMb * 1024) {
      setUploadError(`File gagal diunggah. Ukuran melebihi batas ${settings.maxFileSizeMb} MB.`);
      return;
    }
    setFile({ name: selected.name, sizeKb });
  }

  async function submit() {
    setBusy(true);
    setConfirm(false);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          type,
          content: isFileType ? (file?.name ?? '') : type === 'kode' ? code : text,
          fileName: file?.name,
          fileSizeKb: file?.sizeKb,
          language: type === 'kode' ? language : undefined,
        }),
      });
      const data = (await response.json()) as { ok: boolean; submissionId?: string };
      if (!data.ok || !data.submissionId) throw new Error('gagal');
      router.push(`/student/submissions/${data.submissionId}`);
    } catch {
      setUploadError('Terjadi kesalahan saat mengirim tugas. Silakan coba lagi.');
      setBusy(false);
    }
  }

  if (locked) {
    return (
      <Alert tone="danger" title="Pengumpulan ditutup">
        {lockReason ?? 'Tenggat telah lewat dan tugas ini tidak menerima pengumpulan terlambat.'}
      </Alert>
    );
  }

  return (
    <div>
      <div role="tablist" aria-label="Jenis pengumpulan" className="flex gap-1 rounded-sm bg-muted p-1">
        {types.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={type === item}
            onClick={() => setType(item)}
            className={cn(
              'inline-flex h-10 flex-1 items-center justify-center rounded-sm text-body-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
              type === item ? 'bg-bg text-ink shadow-soft' : 'text-ink-2 hover:text-ink',
            )}
          >
            {TYPE_LABEL[item]}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {type === 'teks' && (
          <>
            <label htmlFor="jawaban-teks" className="text-meta font-medium text-ink">
              Jawaban Anda
            </label>
            <textarea
              id="jawaban-teks"
              rows={14}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Tulis jawaban Anda di sini…"
              className="mt-2 w-full rounded-sm border border-line bg-bg px-4 py-3 text-body-sm leading-relaxed text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
            />
            <p className="mt-2 text-caption text-ink-2">{text.trim().split(/\s+/).filter(Boolean).length} kata</p>
          </>
        )}

        {type === 'kode' && (
          <>
            <Select
              label="Bahasa pemrograman"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              containerClassName="max-w-xs"
            >
              {LANGUAGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <div className="mt-4 flex overflow-hidden rounded-sm border border-line bg-muted">
              <div aria-hidden className="select-none border-r border-line px-3 py-3 text-right font-mono text-caption text-ink-3">
                {lineNumbers.map((line) => (
                  <div key={line} className="leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
              <label htmlFor="jawaban-kode" className="sr-only">
                Kode jawaban
              </label>
              <textarea
                id="jawaban-kode"
                rows={14}
                spellCheck={false}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="def binary_search(data, target):"
                className="w-full resize-y bg-muted px-4 py-3 font-mono text-meta leading-relaxed text-ink placeholder:text-ink-3 focus:outline-none"
              />
            </div>
          </>
        )}

        {isFileType && (
          <div>
            {uploadError && (
              <Alert
                tone="danger"
                className="mb-4"
                action={
                  <Button size="sm" variant="secondary" onClick={() => fileInput.current?.click()}>
                    Coba Lagi
                  </Button>
                }
              >
                {uploadError}
              </Alert>
            )}

            {file ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-line bg-surface p-4">
                <span className="inline-flex min-w-0 items-center gap-3">
                  <FileText className="size-4 shrink-0 text-ink-2" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-body-sm text-ink">{file.name}</span>
                    <span className="block text-caption text-ink-2">{file.sizeKb} KB</span>
                  </span>
                </span>
                <span className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => fileInput.current?.click()}>
                    Ganti
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFile(null)}
                    iconLeft={<Trash2 className="size-4" aria-hidden />}
                  >
                    Hapus
                  </Button>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex w-full flex-col items-center gap-3 rounded-md border border-dashed border-line bg-bg px-6 py-12 text-center transition-colors duration-200 hover:border-accent hover:bg-accent-soft/30 motion-reduce:transition-none"
              >
                <Upload className="size-4 text-ink-2" aria-hidden />
                <span className="text-body-sm text-ink">Unggah {TYPE_LABEL[type]}</span>
                <span className="text-caption text-ink-2">Maksimum {settings.maxFileSizeMb} MB</span>
              </button>
            )}

            <input
              ref={fileInput}
              type="file"
              accept={type === 'pdf' ? '.pdf' : '.doc,.docx'}
              className="sr-only"
              aria-label={`Pilih berkas ${TYPE_LABEL[type]}`}
              onChange={(event) => pickFile(event.target.files?.[0])}
            />
          </div>
        )}
      </div>

      <Button className="mt-6" size="lg" fullWidth disabled={!ready} loading={busy} onClick={() => setConfirm(true)}>
        Kumpulkan Tugas
      </Button>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Kumpulkan tugas sekarang?"
        description="Pastikan jawaban Anda sudah final. Penilaian AI akan dimulai setelah tugas dikumpulkan."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Periksa Kembali
            </Button>
            <Button onClick={submit}>Kumpulkan Tugas</Button>
          </>
        }
      >
        <ul className="flex flex-col gap-2 text-meta text-ink-2">
          <li>Jenis pengumpulan: {TYPE_LABEL[type]}</li>
          {file && <li>Berkas: {file.name}</li>}
          {settings.allowRevision ? (
            <li>Revisi diizinkan hingga {settings.maxRevisions} kali.</li>
          ) : (
            <li>Tugas ini tidak mengizinkan revisi.</li>
          )}
        </ul>
      </Modal>
    </div>
  );
}
