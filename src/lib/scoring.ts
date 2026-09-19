import type { RubricCriterion, ScoredCriterion } from '@/types/domain';

/** Rubric weights must total exactly 100 (%). */
export function totalWeight(criteria: Pick<RubricCriterion, 'weight'>[]): number {
  return criteria.reduce((sum, c) => sum + c.weight, 0);
}

export function isRubricValid(criteria: Pick<RubricCriterion, 'weight'>[]): boolean {
  return totalWeight(criteria) === 100;
}

/** Final weighted score on a 0–100 scale, rounded to one decimal. */
export function weightedScore(criteria: Pick<ScoredCriterion, 'weight' | 'score'>[]): number {
  const weight = totalWeight(criteria);
  if (weight === 0) return 0;
  const raw = criteria.reduce((sum, c) => sum + c.score * c.weight, 0) / weight;
  return Math.round(raw * 10) / 10;
}
