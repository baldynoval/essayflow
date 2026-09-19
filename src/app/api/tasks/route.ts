import { NextResponse } from 'next/server';
import { readSession } from '@/lib/auth/session';
import { isRubricValid } from '@/lib/scoring';

export const runtime = 'nodejs';

/**
 * Creates a task. Persistence is not wired yet: the payload is validated and echoed
 * back so the UI flow is complete and the contract is fixed for the future database.
 */
export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ ok: false, error: 'Judul tugas wajib diisi.' }, { status: 400 });
  }

  const rubric = Array.isArray(body.rubric) ? (body.rubric as { weight: number }[]) : [];
  if (body.status === 'aktif' && !isRubricValid(rubric)) {
    return NextResponse.json({ ok: false, error: 'Total bobot rubrik harus 100%.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, task: { id: `tsk-${Date.now()}`, ...body } }, { status: 201 });
}
