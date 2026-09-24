import { NextResponse } from 'next/server';
import { releaseSubmission } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/** Releases an already-reviewed score/feedback to the student. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const submission = await releaseSubmission(id);
    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal merilis nilai.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
