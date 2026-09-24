import { NextResponse } from 'next/server';
import { respondToJoinRequest } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/** Teacher approves or rejects a pending join request. Body: { approve: boolean } */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.approve !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'Permintaan tidak valid.' }, { status: 400 });
  }

  try {
    const joinRequest = await respondToJoinRequest(id, body.approve);
    return NextResponse.json({ ok: true, joinRequest });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui permintaan.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
