import { describe, expect, it } from "vitest";
import {
  canSaveAnswer,
  computeDeadline,
  DEADLINE_GRACE_SECONDS,
  isExpired,
  remainingSeconds,
  toPublicItem,
} from "@/modules/session/rules";

const start = new Date("2026-11-20T10:00:00Z");

describe("timer", () => {
  it("deadline = start + time limit", () => {
    expect(computeDeadline(start, 20).toISOString()).toBe("2026-11-20T10:20:00.000Z");
  });

  it("remaining time is counted from the server deadline (reload does not reset it)", () => {
    const deadline = computeDeadline(start, 20);
    expect(remainingSeconds(deadline, new Date("2026-11-20T10:05:00Z"))).toBe(15 * 60);
  });

  it("remaining time never goes below zero", () => {
    const deadline = computeDeadline(start, 20);
    expect(remainingSeconds(deadline, new Date("2026-11-20T11:00:00Z"))).toBe(0);
  });

  it("detects an expired attempt", () => {
    const deadline = computeDeadline(start, 20);
    expect(isExpired(deadline, new Date("2026-11-20T10:19:59Z"))).toBe(false);
    expect(isExpired(deadline, new Date("2026-11-20T10:20:01Z"))).toBe(true);
  });
});

describe("saving answers", () => {
  const deadlineAt = computeDeadline(start, 20);

  it("allows saving while the attempt is open", () => {
    expect(canSaveAnswer({ deadlineAt, submittedAt: null }, new Date("2026-11-20T10:10:00Z"))).toEqual({ ok: true });
  });

  it("accepts an answer sent within the grace period", () => {
    const justAfter = new Date(deadlineAt.getTime() + (DEADLINE_GRACE_SECONDS - 1) * 1000);
    expect(canSaveAnswer({ deadlineAt, submittedAt: null }, justAfter).ok).toBe(true);
  });

  it("rejects an answer after the deadline", () => {
    const late = new Date(deadlineAt.getTime() + (DEADLINE_GRACE_SECONDS + 1) * 1000);
    expect(canSaveAnswer({ deadlineAt, submittedAt: null }, late)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects an answer after submit", () => {
    expect(canSaveAnswer({ deadlineAt, submittedAt: new Date() }, new Date("2026-11-20T10:01:00Z"))).toEqual({
      ok: false,
      reason: "submitted",
    });
  });
});

describe("answer keys are not sent to the student (NFR-04)", () => {
  it("removes answerKey and explanation from the item", () => {
    const publicItem = toPublicItem({
      id: "i1",
      position: 1,
      type: "single",
      body: { text: "?" },
      options: [{ id: "A", text: "1" }],
      maxPoints: 1,
      answerKey: { correct: "A" },
      explanation: "secret",
    });
    expect(publicItem).not.toHaveProperty("answerKey");
    expect(publicItem).not.toHaveProperty("explanation");
    expect(JSON.stringify(publicItem)).not.toContain("correct");
  });
});
