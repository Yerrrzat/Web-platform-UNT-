import type { ItemType } from "./types";

/**
 * UNT Informatics scoring rules (FR-06).
 * Kept in one place so they can be adjusted to the official NCT specification
 * without touching the scoring code.
 */
export type PartialRule = {
  /** points for a fully correct answer */
  max: number;
  /** points by number of mistakes: index = mistakes; anything beyond the list = 0 */
  byMistakes: number[];
};

export const SCORING_RULES: Record<ItemType, PartialRule> = {
  // one correct option: 1 or 0
  single: { max: 1, byMistakes: [1] },
  // context-block items are single-choice questions about a shared text/table
  context: { max: 1, byMistakes: [1] },
  // several correct options: 0 mistakes = 2, 1 mistake = 1, 2+ mistakes = 0
  multiple: { max: 2, byMistakes: [2, 1] },
  // matching pairs: all pairs right = 2, one wrong pair = 1, otherwise 0
  matching: { max: 2, byMistakes: [2, 1] },
};

export function pointsForMistakes(type: ItemType, mistakes: number): number {
  const rule = SCORING_RULES[type];
  return rule.byMistakes[mistakes] ?? 0;
}
