/** Pure test-session rules (FR-05, NFR-04). No database access here. */

/** Seconds of tolerance for answers that were sent just before the deadline. */
export const DEADLINE_GRACE_SECONDS = 5;

export function computeDeadline(startedAt: Date, timeLimitMin: number): Date {
  return new Date(startedAt.getTime() + timeLimitMin * 60_000);
}

export function remainingSeconds(deadlineAt: Date, now: Date): number {
  return Math.max(0, Math.ceil((deadlineAt.getTime() - now.getTime()) / 1000));
}

export function isExpired(deadlineAt: Date, now: Date, graceSeconds = 0): boolean {
  return now.getTime() > deadlineAt.getTime() + graceSeconds * 1000;
}

export type AttemptState = {
  deadlineAt: Date;
  submittedAt: Date | null;
};

export type AnswerCheck =
  | { ok: true }
  | { ok: false; reason: "submitted" | "expired" };

/** An answer can be saved only while the attempt is open (deadline + small grace). */
export function canSaveAnswer(attempt: AttemptState, now: Date): AnswerCheck {
  if (attempt.submittedAt) return { ok: false, reason: "submitted" };
  if (isExpired(attempt.deadlineAt, now, DEADLINE_GRACE_SECONDS)) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true };
}

export type StoredItem = {
  id: string;
  position: number;
  type: string;
  body: unknown;
  options: unknown;
  maxPoints: number;
  answerKey?: unknown;
  explanation?: string;
};

export type PublicItem = {
  id: string;
  position: number;
  type: string;
  body: unknown;
  options: unknown;
  maxPoints: number;
};

/**
 * Removes everything the student must not see during the test:
 * the answer key and the explanation (NFR-04).
 */
export function toPublicItem(item: StoredItem): PublicItem {
  return {
    id: item.id,
    position: item.position,
    type: item.type,
    body: item.body,
    options: item.options,
    maxPoints: item.maxPoints,
  };
}
