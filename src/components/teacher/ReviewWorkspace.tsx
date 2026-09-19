'use client';

import { Check, Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FeedbackPanel } from '@/components/ui/FeedbackPanel';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Textarea } from '@/components/ui/Textarea';
import { formatDate, formatScore, formatTime } from '@/lib/format';
import { weightedScore } from '@/lib/scoring';
import type { Feedback, ScoredCriterion, SubmissionVersion } from '@/types/domain';
import { cn } from '@/lib/cn';

export interface ReviewWorkspaceProps {
  student: { name: string; nim: string; email: string; className: string };
  taskTitle: string;
  version: SubmissionVersion;
  initialCriteria: ScoredCriterion[];
  initialFeedback: Feedback;
}

function feedbackToText(feedback: Feedback) {
  return {
    strengths: feedback.strengths.join('\n'),
    improvements: feedback.improvements.join('\n'),
    suggestions: feedback.suggestions.join('\n'),
  };
}

export function ReviewWorkspace({
  student,
  taskTitle,
  version,
  initialCriteria,
  initialFeedback,
}: ReviewWorkspaceProps) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [draftFeedback, setDraftFeedback] = useState(feedbackToText(initialFeedback));
  const [editScores, setEditScores] = useState(false);
  const [editFeedback, setEditFeedback] = useState(false);
  const [adjusted, setAdjusted] = useState<number | null>(null);
  const [adjustInput, setAdjustInput] = useState('');
  const [reason, setReason] = useState('');
  const [confirmAdjust, setConfirmAdjust] = useState(false);
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [saved, setSaved] = useState<'draft' | 'rilis' | null>(null);

  const aiScore = weightedScore(criteria);
  const finalScore = adjusted ?? aiScore;

  function applyFeedback() {
    const split = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
    setFeedback({
      strengths: split(draftFeedback.strengths),
      improvements: split(draftFeedback.improvements),
      suggestions: split(draftFeedback.suggestions),
    });
    setEditFeedback(false);
  }

  function applyAdjustment() {
    const value = Number(adjustInput.replace(',', '.'));
    if (Number.isFinite(value) && value >= 0 && value <= 100) setAdjusted(Math.round(value * 10) / 10);
    setConfirmAdjust(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
      <Card className="h-fit">
        <h2 className="text-body font-medium text-ink">Data Mahasiswa</h2>
        <dl className="mt-6 flex flex-col gap-4 text-meta">
          <div>
            <dt className="text-ink-2">Nama</dt>
            <dd className="mt-1 font-medium text-ink">{student.name}</dd>
          </div>
          <div>
            <dt className="text-ink-2">NIM</dt>
            <dd className="mt-1 tabular-nums text-ink">{student.nim}</dd>
          </div>
          <div>
            <dt className="text-ink-2">Kelas</dt>
            <dd className="mt-1 text-ink">{student.className}</dd>
          </div>
          <div>
            <dt className="text-ink-2">Tugas</dt>
            <dd className="mt-1 text-ink">{taskTitle}</dd>
          </div>
          <div>
            <dt className="text-ink-2">Dikumpulkan</dt>
            <dd className="mt-1 text-ink">
              {formatDate(version.submittedAt)}, {formatTime(version.submittedAt)}
            </dd>
          </div>
          {version.late && (
            <div>
              <Badge tone="warning" dot>
                Terlambat
              </Badge>
            </div>
          )}
        </dl>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-body font-medium text-ink">Jawaban Mahasiswa</h2>
          <Badge>Versi {version.version}</Badge>
        </div>
        {version.fileName && (
          <p className="mt-4 rounded-sm border border-line bg-surface px-4 py-3 text-meta text-ink-2">
            Berkas: {version.fileName} ({version.fileSizeKb} KB)
          </p>
        )}
        <div
          className={cn(
            'mt-6 max-h-[60dvh] overflow-y-auto whitespace-pre-wrap text-body-sm leading-relaxed text-ink-2',
            version.type === 'kode' && 'rounded-sm bg-muted p-4 font-mono text-meta text-ink',
          )}
        >
          {version.content}
        </div>
        <p className="mt-6 border-t border-line pt-4 text-caption text-ink-3">
          Hanya jawaban mahasiswa ini yang ditampilkan pada ruang tinjauan.
        </p>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-3 text-body font-medium text-ink">Evaluasi AI</h2>
            <AIIndicator label={adjusted === null ? 'Draf AI' : 'Disesuaikan'} />
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-b border-line pb-6">
            <ScoreDisplay score={finalScore} size="lg" label="Nilai Akhir" />
            {adjusted !== null && (
              <p className="text-caption text-ink-2">Nilai AI: {formatScore(aiScore)}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h3 className="text-meta font-medium text-ink">Nilai per Kriteria</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditScores((value) => !value)} iconLeft={editScores ? <X className="size-4" aria-hidden /> : <Pencil className="size-4" aria-hidden />}>
              {editScores ? 'Selesai' : 'Edit Nilai'}
            </Button>
          </div>

          <ul className="mt-4 flex flex-col gap-4">
            {criteria.map((criterion) => (
              <li key={criterion.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="min-w-0 truncate text-meta text-ink">{criterion.name}</span>
                  {editScores ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={criterion.score}
                      aria-label={`Nilai ${criterion.name}`}
                      onChange={(event) =>
                        setCriteria((current) =>
                          current.map((item) =>
                            item.id === criterion.id ? { ...item, score: Number(event.target.value) } : item,
                          ),
                        )
                      }
                      className="h-8 w-20 rounded-sm border border-line px-2 text-meta tabular-nums text-ink focus:border-accent focus:outline-none"
                    />
                  ) : (
                    <span className="shrink-0 text-meta tabular-nums text-ink">
                      {formatScore(criterion.score)}
                      <span className="ml-2 text-caption text-ink-2">{criterion.weight}%</span>
                    </span>
                  )}
                </div>
                <div aria-hidden className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${criterion.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-body font-medium text-ink">Feedback</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditFeedback((value) => !value)}
              iconLeft={editFeedback ? <X className="size-4" aria-hidden /> : <Pencil className="size-4" aria-hidden />}
            >
              {editFeedback ? 'Batal' : 'Edit Feedback'}
            </Button>
          </div>

          {editFeedback ? (
            <div className="mt-6 flex flex-col gap-4">
              <Textarea
                label="Yang sudah baik"
                rows={3}
                value={draftFeedback.strengths}
                onChange={(event) => setDraftFeedback({ ...draftFeedback, strengths: event.target.value })}
                hint="Satu poin per baris."
              />
              <Textarea
                label="Yang perlu diperbaiki"
                rows={3}
                value={draftFeedback.improvements}
                onChange={(event) => setDraftFeedback({ ...draftFeedback, improvements: event.target.value })}
              />
              <Textarea
                label="Saran"
                rows={3}
                value={draftFeedback.suggestions}
                onChange={(event) => setDraftFeedback({ ...draftFeedback, suggestions: event.target.value })}
              />
              <Button onClick={applyFeedback} iconLeft={<Save className="size-4" aria-hidden />}>
                Simpan Feedback
              </Button>
            </div>
          ) : (
            <FeedbackPanel className="mt-6" feedback={feedback} columns={false} />
          )}
        </Card>

        <Card>
          <h2 className="text-body font-medium text-ink">Tindakan</h2>
          {saved && (
            <Alert tone="success" className="mt-4">
              {saved === 'draft'
                ? 'Penilaian disimpan sebagai draft. Mahasiswa belum dapat melihat hasil.'
                : 'Hasil dirilis. Mahasiswa kini dapat melihat nilai dan feedback.'}
            </Alert>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="secondary" onClick={() => setConfirmAdjust(true)}>
              Sesuaikan Nilai Akhir
            </Button>
            <Button variant="secondary" onClick={() => setSaved('draft')}>
              Simpan sebagai Draft
            </Button>
            <Button onClick={() => setConfirmRelease(true)} iconLeft={<Check className="size-4" aria-hidden />}>
              Setujui &amp; Rilis
            </Button>
          </div>
          <p className="mt-4 text-caption text-ink-2">
            Penilaian AI bersifat draf. Pengajar adalah pengambil keputusan akhir.
          </p>
        </Card>
      </div>

      <Modal
        open={confirmAdjust}
        onClose={() => setConfirmAdjust(false)}
        title="Sesuaikan Nilai Akhir"
        description="Penyesuaian manual menggantikan nilai hasil perhitungan rubrik. Tindakan ini perlu dikonfirmasi."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmAdjust(false)}>
              Batal
            </Button>
            <Button onClick={applyAdjustment}>Konfirmasi Penyesuaian</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nilai akhir baru"
            type="text"
            inputMode="decimal"
            placeholder="87,5"
            value={adjustInput}
            onChange={(event) => setAdjustInput(event.target.value)}
            hint={`Nilai dari rubrik saat ini: ${formatScore(aiScore)}`}
          />
          <Textarea
            label="Alasan penyesuaian"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Contoh: kedalaman analisis dinilai lebih tinggi setelah ditinjau manual."
          />
        </div>
      </Modal>

      <Modal
        open={confirmRelease}
        onClose={() => setConfirmRelease(false)}
        title="Setujui dan rilis hasil?"
        description={`Nilai akhir ${formatScore(finalScore)} beserta feedback akan terlihat oleh ${student.name}.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmRelease(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                setSaved('rilis');
                setConfirmRelease(false);
              }}
            >
              Setujui &amp; Rilis
            </Button>
          </>
        }
      />
    </div>
  );
}
