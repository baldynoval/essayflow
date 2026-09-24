import { NextResponse } from 'next/server';
import { getTask, updateTask } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';
import { isRubricValid } from '@/lib/scoring';
import type { RubricCriterion, Task, TaskSettings } from '@/types/domain';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Tidak ada sesi aktif.' }, { status: 401 });

  const { id } = await params;
  const task = await getTask(id);
  if (!task) return NextResponse.json({ ok: false, error: 'Tugas tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ ok: true, task });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: 'Permintaan tidak valid.' }, { status: 400 });

  const rubric = Array.isArray(body.rubric) ? (body.rubric as RubricCriterion[]) : undefined;
  const status = body.status as Task['status'] | undefined;
  if (status === 'active' && rubric && !isRubricValid(rubric)) {
    return NextResponse.json({ ok: false, error: 'Total bobot rubrik harus 100%.' }, { status: 400 });
  }

  try {
    const task = await updateTask(id, {
      title: typeof body.title === 'string' ? body.title : undefined,
      instructions: typeof body.instructions === 'string' ? body.instructions : undefined,
      status,
      deadline: typeof body.deadline === 'string' ? body.deadline : undefined,
      rubric,
      settings: body.settings as TaskSettings | undefined,
    });
    return NextResponse.json({ ok: true, task });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui tugas.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
