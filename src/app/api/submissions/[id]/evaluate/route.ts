import { NextResponse } from 'next/server';
import { getSubmission, getTask, latestVersion, saveAIDraftAssessment } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';
import { getAIService } from '@/lib/ai/ai-service';

export const runtime = 'nodejs';

/**
 * Runs the AI grading pass on a submission's latest version and stores the
 * result as an unreleased draft (status → menunggu-review). The teacher then
 * reviews/adjusts it via PATCH /review before releasing it via POST /release.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) return NextResponse.json({ ok: false, error: 'Pengumpulan tidak ditemukan.' }, { status: 404 });

  const task = await getTask(submission.taskId);
  if (!task) return NextResponse.json({ ok: false, error: 'Tugas terkait tidak ditemukan.' }, { status: 404 });

  const version = latestVersion(submission);

  try {
    const draft = await getAIService().evaluate({
      answer: version.content,
      rubric: task.rubric,
      instruction: task.instructions,
    });
    const updated = await saveAIDraftAssessment(id, version.version, draft);
    return NextResponse.json({ ok: true, submission: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI gagal menilai pengumpulan.';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
