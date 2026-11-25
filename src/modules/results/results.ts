/** Pure functions for the results page (FR-08, FR-09, FR-10). No database access. */

export type TopicRef = { code: string; name: string };

export type ResultItem = {
  itemId: string;
  position: number;
  points: number;
  maxPoints: number;
  hasAnswer: boolean;
  topics: TopicRef[];
};

export type ItemStatus = "correct" | "partial" | "wrong" | "empty";

export function itemStatus(item: Pick<ResultItem, "points" | "maxPoints" | "hasAnswer">): ItemStatus {
  if (!item.hasAnswer) return "empty";
  if (item.points >= item.maxPoints) return "correct";
  if (item.points > 0) return "partial";
  return "wrong";
}

export type TopicScore = {
  code: string;
  name: string;
  earned: number;
  max: number;
  /** 0..100, rounded */
  percent: number;
  itemCount: number;
  weakest: boolean;
};

/**
 * Percentage of points earned per specification topic.
 * The topic with the lowest percentage is marked as weakest (FR-09).
 * An item with several topics counts in each of them.
 */
export function topicBreakdown(items: ResultItem[]): TopicScore[] {
  const byTopic = new Map<string, TopicScore>();
  for (const item of items) {
    for (const t of item.topics) {
      const row = byTopic.get(t.code) ?? {
        code: t.code,
        name: t.name,
        earned: 0,
        max: 0,
        percent: 0,
        itemCount: 0,
        weakest: false,
      };
      row.earned += item.points;
      row.max += item.maxPoints;
      row.itemCount += 1;
      byTopic.set(t.code, row);
    }
  }

  const rows = [...byTopic.values()].map((r) => ({
    ...r,
    percent: r.max === 0 ? 0 : Math.round((r.earned / r.max) * 100),
  }));
  if (rows.length === 0) return rows;

  // weakest = lowest share of points; on a tie, the topic with more items
  const weakest = rows.reduce((min, r) => {
    const a = r.max === 0 ? 0 : r.earned / r.max;
    const b = min.max === 0 ? 0 : min.earned / min.max;
    if (a < b) return r;
    if (a === b && r.itemCount > min.itemCount) return r;
    return min;
  });
  // all topics fully correct: nothing to highlight
  const allPerfect = rows.every((r) => r.earned === r.max);

  return rows
    .map((r) => ({ ...r, weakest: !allPerfect && r.code === weakest.code }))
    .sort((a, b) => a.percent - b.percent || a.name.localeCompare(b.name));
}

export function scorePercent(score: number, max: number): number {
  return max === 0 ? 0 : Math.round((score / max) * 100);
}

type Option = { id: string; text: string };
type Response = { choice?: string; choices?: string[]; pairs?: Record<string, string> } | null;
type Key = { correct: string | string[] | Record<string, string> };

/** Human-readable answer, e.g. "B) 1024" or "1 → B, 2 → A" */
export function formatResponse(type: string, response: Response, options: Option[]): string {
  if (!response) return "—";
  const label = (id: string) => {
    const o = options.find((x) => x.id === id);
    return o ? `${o.id}) ${o.text}` : id;
  };
  if ((type === "single" || type === "context") && response.choice) return label(response.choice);
  if (type === "multiple" && response.choices && response.choices.length > 0) {
    return [...response.choices].sort().map(label).join("; ");
  }
  if (type === "matching" && response.pairs) {
    const pairs = Object.entries(response.pairs).filter(([, v]) => Boolean(v));
    if (pairs.length === 0) return "—";
    return pairs
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([left, right]) => `${left} → ${right}`)
      .join(", ");
  }
  return "—";
}

/** Correct answer in the same format as the student's answer. */
export function formatKey(type: string, key: Key, options: Option[]): string {
  if (type === "single" || type === "context") {
    return formatResponse(type, { choice: key.correct as string }, options);
  }
  if (type === "multiple") return formatResponse(type, { choices: key.correct as string[] }, options);
  return formatResponse(type, { pairs: key.correct as Record<string, string> }, options);
}
