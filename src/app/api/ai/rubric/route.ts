import { NextResponse } from 'next/server';
import { readSession } from '@/lib/auth/session';
import { RUBRIC_PRESETS, getAIService, isAIProviderConfigured, presetRubric, type RubricPresetId } from '@/lib/ai/ai-service';

export const runtime = 'nodejs';

function isPreset(value: unknown): value is RubricPresetId {
  return RUBRIC_PRESETS.some((preset) => preset.id === value);
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== 'pengajar') {
    return NextResponse.json({ error: 'Tidak memiliki akses.' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const preset = isPreset(body.preset) ? body.preset : 'seimbang';
  const instruction = typeof body.instruction === 'string' && body.instruction.trim()
    ? body.instruction
    : RUBRIC_PRESETS.find((item) => item.id === preset)?.instruction;

  try {
    const result = await getAIService().suggestRubric({
      title: typeof body.title === 'string' ? body.title : '',
      instructions: typeof body.instructions === 'string' ? body.instructions : '',
      instruction,
    });
    // With no real provider configured, the mock's output is deterministic and
    // generic, so the preset's hand-tuned rubric is more useful to show — keep
    // that fallback. Once AI_PROVIDER_API_KEY is set, use the model's own criteria.
    const criteria = isAIProviderConfigured() ? result.criteria : presetRubric(preset);
    return NextResponse.json({ criteria, note: result.note });
  } catch {
    return NextResponse.json({ error: 'AI gagal menyusun rubrik.' }, { status: 502 });
  }
}
