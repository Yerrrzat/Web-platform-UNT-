/**
 * Pilot metrics for the admin dashboard (FR-17, docs/09).
 * Pure functions over plain data, so they are easy to test.
 */

export type UserRow = { id: string; createdAt: Date };

export type AttemptRow = {
  userId: string;
  startedAt: Date;
  submittedAt: Date | null;
  score: number | null;
  maxScore: number;
};

export type EventRow = { name: string; userId: string | null; createdAt: Date };

function pct(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return Math.round((part / whole) * 1000) / 10; // one decimal
}

/** Activation: share of registered students who started at least one test. */
export function activationRate(users: UserRow[], attempts: AttemptRow[]): number | null {
  const started = new Set(attempts.map((a) => a.userId));
  return pct(users.filter((u) => started.has(u.id)).length, users.length);
}

/** Completion: share of started attempts that were submitted. */
export function completionRate(attempts: AttemptRow[]): number | null {
  return pct(attempts.filter((a) => a.submittedAt).length, attempts.length);
}

function attemptPercent(a: AttemptRow): number {
  return a.maxScore === 0 ? 0 : ((a.score ?? 0) / a.maxScore) * 100;
}

/** Average score of submitted attempts, in percent of the maximum. */
export function averageScorePercent(attempts: AttemptRow[]): number | null {
  const done = attempts.filter((a) => a.submittedAt);
  if (done.length === 0) return null;
  const avg = done.reduce((s, a) => s + attemptPercent(a), 0) / done.length;
  return Math.round(avg * 10) / 10;
}

/**
 * Score growth: for every student with at least 3 submitted attempts,
 * (3rd attempt % − 1st attempt %). Returns the average in percentage points
 * and how many students it is based on. Target in the pilot: +10 p.p.
 */
export function scoreGrowth(attempts: AttemptRow[]): { average: number | null; students: number } {
  const byUser = new Map<string, AttemptRow[]>();
  for (const a of attempts) {
    if (!a.submittedAt) continue;
    byUser.set(a.userId, [...(byUser.get(a.userId) ?? []), a]);
  }
  const deltas: number[] = [];
  for (const list of byUser.values()) {
    if (list.length < 3) continue;
    const sorted = [...list].sort((x, y) => x.submittedAt!.getTime() - y.submittedAt!.getTime());
    deltas.push(attemptPercent(sorted[2]) - attemptPercent(sorted[0]));
  }
  if (deltas.length === 0) return { average: null, students: 0 };
  const avg = deltas.reduce((s, d) => s + d, 0) / deltas.length;
  return { average: Math.round(avg * 10) / 10, students: deltas.length };
}

/** Conversion: share of registered users who paid (from the events table). */
export function conversionRate(events: EventRow[]): number | null {
  const registered = new Set(events.filter((e) => e.name === "registration").map((e) => e.userId));
  const paid = new Set(
    events.filter((e) => e.name === "payment" && registered.has(e.userId)).map((e) => e.userId),
  );
  return pct(paid.size, registered.size);
}

export const FUNNEL_STEPS = [
  "registration",
  "test_start",
  "test_finish",
  "paywall_view",
  "checkout_start",
  "payment",
] as const;

/** Unique users per funnel step. */
export function funnel(events: EventRow[]): { name: string; users: number }[] {
  return FUNNEL_STEPS.map((name) => ({
    name,
    users: new Set(events.filter((e) => e.name === name && e.userId).map((e) => e.userId)).size,
  }));
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Average score (%) of submitted attempts per day for the last `days` days.
 * Days without attempts have value null (the chart skips them).
 */
export function dailyAverageScore(
  attempts: AttemptRow[],
  days: number,
  now: Date,
): { day: string; value: number | null; count: number }[] {
  const series: { day: string; value: number | null; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    series.push({ day: dayKey(d), value: null, count: 0 });
  }
  const index = new Map(series.map((s, i) => [s.day, i]));
  const sums = new Map<string, number>();
  for (const a of attempts) {
    if (!a.submittedAt) continue;
    const key = dayKey(a.submittedAt);
    const i = index.get(key);
    if (i === undefined) continue;
    series[i].count += 1;
    sums.set(key, (sums.get(key) ?? 0) + attemptPercent(a));
  }
  return series.map((s) =>
    s.count === 0 ? s : { ...s, value: Math.round((sums.get(s.day)! / s.count) * 10) / 10 },
  );
}

/** Start of the period: now minus `days` days. */
export function periodStart(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}
