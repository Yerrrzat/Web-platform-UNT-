import { describe, expect, it } from "vitest";
import { countMistakes, scoreAttempt, scoreItem, type ScorableItem } from "@/modules/scoring";

const single: ScorableItem = { id: "s1", type: "single", answerKey: { correct: "B" }, maxPoints: 1 };
const context: ScorableItem = { id: "c1", type: "context", answerKey: { correct: "C" }, maxPoints: 1 };
const multiple: ScorableItem = {
  id: "m1",
  type: "multiple",
  answerKey: { correct: ["A", "C", "E"] },
  maxPoints: 2,
};
const matching: ScorableItem = {
  id: "p1",
  type: "matching",
  answerKey: { correct: { "1": "B", "2": "A", "3": "C" } },
  maxPoints: 2,
};

describe("single-choice items (1 / 0)", () => {
  it("gives 1 point for the correct option", () => {
    expect(scoreItem(single, { choice: "B" })).toMatchObject({ points: 1, status: "correct" });
  });
  it("gives 0 for a wrong option", () => {
    expect(scoreItem(single, { choice: "A" })).toMatchObject({ points: 0, status: "wrong" });
  });
  it("gives 0 and status empty when there is no answer", () => {
    expect(scoreItem(single, null)).toMatchObject({ points: 0, status: "empty" });
    expect(scoreItem(single, { choice: "" })).toMatchObject({ points: 0, status: "empty" });
  });
  it("scores context-block items like single choice", () => {
    expect(scoreItem(context, { choice: "C" }).points).toBe(1);
    expect(scoreItem(context, { choice: "D" }).points).toBe(0);
  });
});

describe("multiple-choice items (2 / 1 / 0)", () => {
  it("gives 2 points when all correct options are chosen", () => {
    expect(scoreItem(multiple, { choices: ["E", "A", "C"] })).toMatchObject({ points: 2, status: "correct" });
  });
  it("gives 1 point when one correct option is missing", () => {
    expect(scoreItem(multiple, { choices: ["A", "C"] })).toMatchObject({ points: 1, status: "partial" });
  });
  it("gives 1 point when one extra wrong option is chosen", () => {
    expect(scoreItem(multiple, { choices: ["A", "C", "E", "F"] }).points).toBe(1);
  });
  it("gives 0 for two mistakes", () => {
    expect(scoreItem(multiple, { choices: ["A", "B"] })).toMatchObject({ points: 0, status: "wrong" });
  });
  it("gives 0 when all options are selected", () => {
    expect(scoreItem(multiple, { choices: ["A", "B", "C", "D", "E", "F"] }).points).toBe(0);
  });
  it("gives 0 for an empty selection (not 1 point)", () => {
    expect(scoreItem(multiple, { choices: [] })).toMatchObject({ points: 0, status: "empty" });
  });
  it("counts missed and extra options as mistakes", () => {
    expect(countMistakes(multiple, { choices: ["A", "D"] })).toBe(3);
  });
});

describe("matching items (2 / 1 / 0)", () => {
  it("gives 2 points when all pairs are correct", () => {
    expect(scoreItem(matching, { pairs: { "1": "B", "2": "A", "3": "C" } }).points).toBe(2);
  });
  it("gives 1 point for one wrong pair", () => {
    expect(scoreItem(matching, { pairs: { "1": "B", "2": "A", "3": "D" } })).toMatchObject({ points: 1, status: "partial" });
  });
  it("counts a missing pair as a mistake", () => {
    expect(scoreItem(matching, { pairs: { "1": "B", "2": "A" } }).points).toBe(1);
  });
  it("gives 0 for two or more wrong pairs", () => {
    expect(scoreItem(matching, { pairs: { "1": "A", "2": "B", "3": "C" } }).points).toBe(0);
  });
  it("gives 0 and status empty when nothing is matched", () => {
    expect(scoreItem(matching, { pairs: {} }).status).toBe("empty");
    expect(scoreItem(matching, { pairs: { "1": "" } }).status).toBe("empty");
  });
});

describe("whole attempt", () => {
  const items = [single, context, multiple, matching];

  it("total equals the sum of item scores; unanswered items get 0", () => {
    const result = scoreAttempt(
      items,
      new Map([
        ["s1", { choice: "B" }], // 1
        ["m1", { choices: ["A", "C"] }], // 1
        ["p1", { pairs: { "1": "B", "2": "A", "3": "C" } }], // 2
      ]),
    );
    expect(result.total).toBe(4);
    expect(result.max).toBe(6);
    expect(result.items.find((i) => i.itemId === "c1")?.status).toBe("empty");
  });

  it("gives the maximum for a fully correct attempt", () => {
    const result = scoreAttempt(
      items,
      new Map([
        ["s1", { choice: "B" }],
        ["c1", { choice: "C" }],
        ["m1", { choices: ["A", "C", "E"] }],
        ["p1", { pairs: { "1": "B", "2": "A", "3": "C" } }],
      ]),
    );
    expect(result.total).toBe(result.max);
  });

  it("gives 0 for an empty attempt", () => {
    expect(scoreAttempt(items, new Map()).total).toBe(0);
  });
});
