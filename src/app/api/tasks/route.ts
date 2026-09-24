import { NextResponse } from 'next/server';
import { createTask, listTasks } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';
import { isRubricValid } from '@/lib/scoring';
import type { RubricCriterion, Task, TaskSettings } from '@/types/domain';

export const runtime = 'nodejs';

/** Lists tasks, optionally filtered by ?classId=. RLS scopes results to the teacher's own classes or the student's enrolled ones. */
export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Tidak ada sesi aktif.' }, { status: 401 });

  const classId = new URL(request.url).searchParams.get('classId') ?? undefined;
  const tasks = await listTasks(classId ? { classId } : undefined);
  return NextResponse.json({ ok: true, tasks });
}

const DEFAULT_SETTINGS: TaskSettings = {
  submissionTypes: ['teks'],
  latePolicy: 'sampai-tugas-ditutup',
  maxFileSizeMb: 10,
  allowRevision: false,
  maxRevisions: 0,
  aiGrading: false,
  aiReEvaluateRevisions: false,
};

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ ok: false, error: 'Judul tugas wajib diisi.' }, { status: 400 });
  }
  if (typeof body.classId !== 'string' || !body.classId) {
    return NextResponse.json({ ok: false, error: 'Kelas wajib dipilih.' }, { status: 400 });
  }
  if (typeof body.deadline !== 'string' || !body.deadline) {
    return NextResponse.json({ ok: false, error: 'Tenggat waktu wajib diisi.' }, { status: 400 });
  }

  const rubric = Array.isArray(body.rubric) ? (body.rubric as RubricCriterion[]) : [];
  const status = (body.status as Task['status']) ?? 'draft';
  if (status === 'active' && !isRubricValid(rubric)) {
    return NextResponse.json({ ok: false, error: 'Total bobot rubrik harus 100%.' }, { status: 400 });
  }

  try {
    const task = await createTask({
      title: body.title.trim(),
      instructions: typeof body.instructions === 'string' ? body.instructions : '',
      classId: body.classId,
      status,
      deadline: body.deadline,
      rubric,
      settings: { ...DEFAULT_SETTINGS, ...(body.settings as Partial<TaskSettings> | undefined) },
    });
    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (error) {
    // e.g. RLS blocked the insert because classId isn't one of this teacher's classes.
    const message = error instanceof Error ? error.message : 'Gagal membuat tugas.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
