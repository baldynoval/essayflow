import { NextResponse } from 'next/server';
import { createSubmission, listSubmissions } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';
import type { SubmissionType } from '@/types/domain';

export const runtime = 'nodejs';

const VALID_TYPES: SubmissionType[] = ['teks', 'kode', 'pdf', 'word'];

/**
 * Lists submissions, optionally filtered by ?taskId= (teacher grading a task)
 * or ?studentId= (a student's own history). RLS still applies underneath —
 * a student can only ever see their own rows regardless of the filter passed.
 */
export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Tidak ada sesi aktif.' }, { status: 401 });

  const params = new URL(request.url).searchParams;
  const taskId = params.get('taskId') ?? undefined;
  const studentId = session.role === 'mahasiswa' ? session.userId : (params.get('studentId') ?? undefined);

  const submissions = await listSubmissions({ taskId, studentId });
  return NextResponse.json({ ok: true, submissions });
}

/**
 * Accepts a submission and writes it to the database: finds or creates the
 * student's submission row for the task, then appends the next version.
 */
export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'mahasiswa') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.taskId !== 'string' || !body.taskId) {
    return NextResponse.json({ ok: false, error: 'Permintaan tidak valid.' }, { status: 400 });
  }
  if (typeof body.content !== 'string' || !body.content.trim()) {
    return NextResponse.json({ ok: false, error: 'Jawaban tidak boleh kosong.' }, { status: 400 });
  }

  const type = (typeof body.type === 'string' ? body.type : 'teks') as SubmissionType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: 'Jenis pengumpulan tidak dikenali.' }, { status: 400 });
  }

  try {
    const submission = await createSubmission({
      taskId: body.taskId,
      studentId: session.userId,
      type,
      content: body.content,
      fileName: typeof body.fileName === 'string' ? body.fileName : undefined,
      fileSizeKb: typeof body.fileSizeKb === 'number' ? body.fileSizeKb : undefined,
    });
    return NextResponse.json({ ok: true, submissionId: submission.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan pengumpulan.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
