import { NextResponse } from 'next/server';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/**
 * Accepts a submission. Persistence and the real AI pipeline are not wired yet;
 * the route validates the payload and returns the id the UI navigates to.
 */
export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'mahasiswa') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.taskId !== 'string') {
    return NextResponse.json({ ok: false, error: 'Permintaan tidak valid.' }, { status: 400 });
  }
  if (typeof body.content !== 'string' || !body.content.trim()) {
    return NextResponse.json({ ok: false, error: 'Jawaban tidak boleh kosong.' }, { status: 400 });
  }

  // Lingkungan demo memetakan ke pengumpulan contoh agar alur status dapat ditelusuri.
  return NextResponse.json({ ok: true, submissionId: 'sub-06' }, { status: 201 });
}
