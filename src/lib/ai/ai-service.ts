/**
 * AI service contract.
 *
 * The real provider is not wired yet. No API key is invented here; the provider is
 * selected through environment variables and falls back to a deterministic mock so
 * every module is testable offline.
 *
 * The output of this service is ALWAYS a draft: the teacher approves and releases.
 */

import { DEFAULT_RUBRIC } from '@/data/mock';
import { weightedScore } from '@/lib/scoring';
import type { Feedback, RubricCriterion, ScoredCriterion } from '@/types/domain';

export interface RubricSuggestion {
  criteria: RubricCriterion[];
  /** Short rationale shown next to the suggestion. */
  note: string;
}

export interface EvaluationDraft {
  criteria: ScoredCriterion[];
  feedback: Feedback;
  score: number;
}

export interface AIService {
  suggestRubric(input: { title: string; instructions: string; instruction?: string }): Promise<RubricSuggestion>;
  evaluate(input: { answer: string; rubric: RubricCriterion[]; instruction?: string }): Promise<EvaluationDraft>;
}

export const RUBRIC_PRESETS = [
  { id: 'seimbang', label: 'Seimbang', instruction: 'Bagi bobot secara seimbang antar kriteria utama.' },
  { id: 'analisis', label: 'Fokus analisis', instruction: 'Beri bobot lebih besar pada kedalaman analisis.' },
  { id: 'bahasa', label: 'Fokus bahasa akademik', instruction: 'Beri bobot lebih besar pada penggunaan bahasa dan sitasi.' },
  { id: 'kode', label: 'Tugas pemrograman', instruction: 'Sesuaikan untuk tugas kode: kebenaran, efisiensi, keterbacaan.' },
] as const;

export type RubricPresetId = (typeof RUBRIC_PRESETS)[number]['id'];

const PRESET_RUBRICS: Record<RubricPresetId, RubricCriterion[]> = {
  seimbang: DEFAULT_RUBRIC,
  analisis: [
    { id: 'rb-a1', name: 'Kedalaman Analisis', weight: 40, description: 'Menguraikan sebab, akibat, dan keterbatasan argumen.' },
    { id: 'rb-a2', name: 'Kesesuaian dengan Topik', weight: 25, description: 'Jawaban tetap berada pada ruang lingkup pertanyaan.' },
    { id: 'rb-a3', name: 'Struktur Argumentasi', weight: 20, description: 'Alur penalaran runtut dan saling terhubung.' },
    { id: 'rb-a4', name: 'Penggunaan Bahasa', weight: 15, description: 'Bahasa akademik dan istilah teknis yang konsisten.' },
  ],
  bahasa: [
    { id: 'rb-b1', name: 'Penggunaan Bahasa', weight: 35, description: 'Ejaan, tata kalimat, dan ragam akademik.' },
    { id: 'rb-b2', name: 'Kesesuaian dengan Topik', weight: 25, description: 'Relevansi isi terhadap pertanyaan.' },
    { id: 'rb-b3', name: 'Struktur Argumentasi', weight: 25, description: 'Paragraf tersusun dengan gagasan utama yang jelas.' },
    { id: 'rb-b4', name: 'Sitasi dan Rujukan', weight: 15, description: 'Rujukan ditulis lengkap dan konsisten.' },
  ],
  kode: [
    { id: 'rb-k1', name: 'Kebenaran Program', weight: 35, description: 'Program berjalan dan memenuhi seluruh kasus uji.' },
    { id: 'rb-k2', name: 'Efisiensi Algoritma', weight: 25, description: 'Kompleksitas waktu dan ruang yang wajar.' },
    { id: 'rb-k3', name: 'Keterbacaan Kode', weight: 20, description: 'Penamaan, struktur, dan komentar yang jelas.' },
    { id: 'rb-k4', name: 'Dokumentasi', weight: 20, description: 'Penjelasan cara kerja dan asumsi yang dipakai.' },
  ],
};

export function presetRubric(preset: RubricPresetId): RubricCriterion[] {
  return PRESET_RUBRICS[preset];
}

class MockAIService implements AIService {
  async suggestRubric({ instruction }: { title: string; instructions: string; instruction?: string }) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const lower = (instruction ?? '').toLowerCase();
    const preset: RubricPresetId = lower.includes('kode')
      ? 'kode'
      : lower.includes('bahasa')
        ? 'bahasa'
        : lower.includes('analisis')
          ? 'analisis'
          : 'seimbang';
    return {
      criteria: PRESET_RUBRICS[preset],
      note: 'Saran rubrik disusun dari judul dan instruksi tugas. Bobot dapat diubah sebelum disimpan.',
    };
  }

  async evaluate({ answer, rubric }: { answer: string; rubric: RubricCriterion[]; instruction?: string }) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Deterministic pseudo-scoring so the mock stays stable between runs.
    const seed = answer.length % 7;
    const criteria: ScoredCriterion[] = rubric.map((criterion, index) => ({
      ...criterion,
      score: Math.min(96, 74 + ((seed + index * 3) % 18)),
    }));
    return {
      criteria,
      score: weightedScore(criteria),
      feedback: {
        strengths: [
          'Penjelasan konsep utama sudah tepat dan mudah diikuti.',
          'Contoh yang diberikan relevan dengan instruksi tugas.',
        ],
        improvements: [
          'Beberapa klaim belum disertai alasan atau rujukan.',
          'Pembahasan pada bagian akhir masih terlalu ringkas.',
        ],
        suggestions: [
          'Tambahkan perbandingan kuantitatif agar analisis lebih kuat.',
          'Rapikan paragraf penutup menjadi simpulan yang tegas.',
        ],
      },
    };
  }
}

let instance: AIService | null = null;

export function getAIService(): AIService {
  if (!instance) instance = new MockAIService();
  return instance;
}

/** True when a real provider is configured. Used to label the UI honestly. */
export function isAIProviderConfigured(): boolean {
  return Boolean(process.env.AI_PROVIDER_API_KEY);
}
