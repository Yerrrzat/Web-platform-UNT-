import { pointsForMistakes } from "./rules";
import type {
  AttemptScore,
  ItemResponse,
  ItemScore,
  MatchingKey,
  MultipleKey,
  ScorableItem,
  SingleKey,
} from "./types";

/** Pure scoring functions: no database, no side effects (FR-06). */

function isEmpty(item: ScorableItem, response: ItemResponse | null | undefined): boolean {
  if (!response) return true;
  switch (item.type) {
    case "single":
    case "context":
      return !("choice" in response) || !response.choice;
    case "multiple":
      return !("choices" in response) || response.choices.length === 0;
    case "matching":
      return (
        !("pairs" in response) ||
        Object.values(response.pairs).filter((v) => Boolean(v)).length === 0
      );
  }
}

/** Number of mistakes in an answer (assumes the answer is not empty). */
export function countMistakes(item: ScorableItem, response: ItemResponse): number {
  switch (item.type) {
    case "single":
    case "context": {
      const key = item.answerKey as SingleKey;
      return (response as { choice: string }).choice === key.correct ? 0 : 1;
    }
    case "multiple": {
      const correct = new Set((item.answerKey as MultipleKey).correct);
      const chosen = new Set((response as { choices: string[] }).choices);
      let mistakes = 0;
      for (const c of correct) if (!chosen.has(c)) mistakes++; // missed a correct option
      for (const c of chosen) if (!correct.has(c)) mistakes++; // chose a wrong option
      return mistakes;
    }
    case "matching": {
      const correct = (item.answerKey as MatchingKey).correct;
      const pairs = (response as { pairs: Record<string, string> }).pairs;
      let mistakes = 0;
      for (const left of Object.keys(correct)) {
        if (pairs[left] !== correct[left]) mistakes++; // wrong or missing pair
      }
      return mistakes;
    }
  }
}

export function scoreItem(
  item: ScorableItem,
  response: ItemResponse | null | undefined,
): ItemScore {
  if (isEmpty(item, response)) {
    return { itemId: item.id, points: 0, maxPoints: item.maxPoints, status: "empty" };
  }
  const mistakes = countMistakes(item, response as ItemResponse);
  const points = Math.min(pointsForMistakes(item.type, mistakes), item.maxPoints);
  const status = points === item.maxPoints ? "correct" : points > 0 ? "partial" : "wrong";
  return { itemId: item.id, points, maxPoints: item.maxPoints, status };
}

/** Scores a whole attempt. Unanswered items get 0. Total = sum of item scores. */
export function scoreAttempt(
  items: ScorableItem[],
  responses: Map<string, ItemResponse | null | undefined>,
): AttemptScore {
  const scored = items.map((item) => scoreItem(item, responses.get(item.id)));
  return {
    total: scored.reduce((sum, s) => sum + s.points, 0),
    max: scored.reduce((sum, s) => sum + s.maxPoints, 0),
    items: scored,
  };
}
