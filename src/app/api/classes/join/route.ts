import { NextResponse } from 'next/server';
import { requestJoinClass } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/** Student submits a join request using a class's share code. Needs teacher approval (see /api/join-requests/[id]). */
export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'mahasiswa') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.code !== 'string' || !body.code.trim()) {
    return NextResponse.json({ ok: false, error: 'Kode kelas wajib diisi.' }, { status: 400 });
  }

  try {
    const joinRequest = await requestJoinClass(body.code, typeof body.reason === 'string' ? body.reason : undefined);
    return NextResponse.json({ ok: true, joinRequest }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengirim permintaan gabung.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
