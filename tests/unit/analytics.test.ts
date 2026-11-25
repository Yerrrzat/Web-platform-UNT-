import { describe, expect, it } from "vitest";
import {
  activationRate,
  averageScorePercent,
  completionRate,
  conversionRate,
  dailyAverageScore,
  funnel,
  scoreGrowth,
  type AttemptRow,
  type EventRow,
} from "@/modules/analytics/metrics";
import { toCsv } from "@/modules/analytics/csv";

const day = (n: number) => new Date(Date.UTC(2026, 10, n, 10, 0, 0)); // November 2026

function attempt(userId: string, n: number, score: number | null, submitted = true): AttemptRow {
  return { userId, startedAt: day(n), submittedAt: submitted ? day(n) : null, score, maxScore: 50 };
}

describe("activation", () => {
  const users = [
    { id: "u1", createdAt: day(1) },
    { id: "u2", createdAt: day(1) },
    { id: "u3", createdAt: day(2) },
    { id: "u4", createdAt: day(2) },
  ];

  it("is the share of students who started at least one test", () => {
    expect(activationRate(users, [attempt("u1", 3, 20), attempt("u1", 4, 25), attempt("u3", 3, 30)])).toBe(50);
  });

  it("returns null when there are no students (no data, not 0%)", () => {
    expect(activationRate([], [])).toBeNull();
  });
});

describe("completion", () => {
  it("is the share of started attempts that were submitted", () => {
    expect(completionRate([attempt("u1", 1, 10), attempt("u1", 2, 20), attempt("u2", 2, null, false)])).toBe(66.7);
  });

  it("returns null without attempts", () => {
    expect(completionRate([])).toBeNull();
  });
});

describe("average score", () => {
  it("counts only submitted attempts, in percent of the maximum", () => {
    expect(averageScorePercent([attempt("u1", 1, 25), attempt("u2", 1, 50), attempt("u3", 1, null, false)])).toBe(75);
  });

  it("returns null when nothing is submitted", () => {
    expect(averageScorePercent([attempt("u1", 1, null, false)])).toBeNull();
  });
});

describe("score growth (1st → 3rd attempt)", () => {
  it("averages the growth in percentage points over students with ≥ 3 attempts", () => {
    const attempts = [
      attempt("u1", 1, 10),
      attempt("u1", 3, 15),
      attempt("u1", 5, 20),
      attempt("u1", 7, 50),
      attempt("u2", 2, 25),
      attempt("u2", 4, 30),
      attempt("u2", 6, 25),
    ];
    expect(scoreGrowth(attempts)).toEqual({ average: 10, students: 2 });
  });

  it("uses the order of submission, not the order in the array", () => {
    expect(scoreGrowth([attempt("u1", 9, 40), attempt("u1", 1, 10), attempt("u1", 5, 20)]).average).toBe(60);
  });

  it("ignores students with fewer than 3 submitted attempts", () => {
    expect(scoreGrowth([attempt("u1", 1, 10), attempt("u1", 2, 40), attempt("u1", 3, 45, false)])).toEqual({
      average: null,
      students: 0,
    });
  });

  it("returns no data for an empty list", () => {
    expect(scoreGrowth([])).toEqual({ average: null, students: 0 });
  });
});

describe("conversion and funnel (events table)", () => {
  const events: EventRow[] = [
    { name: "registration", userId: "u1", createdAt: day(1) },
    { name: "registration", userId: "u2", createdAt: day(1) },
    { name: "registration", userId: "u3", createdAt: day(1) },
    { name: "registration", userId: "u4", createdAt: day(1) },
    { name: "test_start", userId: "u1", createdAt: day(2) },
    { name: "test_start", userId: "u1", createdAt: day(3) },
    { name: "test_start", userId: "u2", createdAt: day(2) },
    { name: "payment", userId: "u1", createdAt: day(4) },
  ];

  it("conversion = paid users / registered users", () => {
    expect(conversionRate(events)).toBe(25);
  });

  it("returns null without registrations", () => {
    expect(conversionRate([])).toBeNull();
  });

  it("funnel counts unique users per step", () => {
    const steps = Object.fromEntries(funnel(events).map((s) => [s.name, s.users]));
    expect(steps).toMatchObject({ registration: 4, test_start: 2, payment: 1, checkout_start: 0 });
  });
});

describe("daily average score", () => {
  it("returns one point per day; days without tests have null", () => {
    const series = dailyAverageScore([attempt("u1", 14, 25), attempt("u2", 14, 50), attempt("u3", 12, 10)], 3, day(14));
    expect(series).toEqual([
      { day: "2026-11-12", value: 20, count: 1 },
      { day: "2026-11-13", value: null, count: 0 },
      { day: "2026-11-14", value: 75, count: 2 },
    ]);
  });
});

describe("CSV export", () => {
  it("quotes values with commas and quotes", () => {
    expect(toCsv(["a", "b"], [["1", 'x,"y"']])).toBe('a,b\n1,"x,""y"""\n');
  });
});
