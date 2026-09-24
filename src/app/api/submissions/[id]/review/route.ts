import { NextResponse } from 'next/server';
import { reviewSubmission } from '@/lib/data/repository';
import { readSession } from '@/lib/auth/session';
import type { Feedback, ScoredCriterion } from '@/types/domain';

export const runtime = 'nodejs';

/**
 * Teacher submits (or edits) the score/feedback for a submission — typically
 * starting from the AI draft (see /evaluate) and adjusting it. Does NOT
 * reveal anything to the student yet; call /release for that.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ ok: false, error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !Array.isArray(body.criteria) || typeof body.aiScore !== 'number') {
    return NextResponse.json({ ok: false, error: 'Permintaan tidak valid.' }, { status: 400 });
  }

  try {
    const submission = await reviewSubmission(id, {
      version: typeof body.version === 'number' ? body.version : undefined,
      criteria: body.criteria as ScoredCriterion[],
      feedback: (body.feedback as Feedback) ?? { strengths: [], improvements: [], suggestions: [] },
      aiScore: body.aiScore,
      adjustedScore: typeof body.adjustedScore === 'number' ? body.adjustedScore : undefined,
      adjustmentReason: typeof body.adjustmentReason === 'string' ? body.adjustmentReason : undefined,
    });
    return NextResponse.json({ ok: true, submission });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan penilaian.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
