import { NextResponse } from 'next/server';
import { getSubmission } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return NextResponse.json({ ok: false, error: 'Tidak ada sesi aktif.' }, { status: 401 });

  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) return NextResponse.json({ ok: false, error: 'Pengumpulan tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ ok: true, submission });
}
