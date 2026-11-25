import { describe, expect, it } from "vitest";
import {
  formatKey,
  formatResponse,
  itemStatus,
  scorePercent,
  topicBreakdown,
  type ResultItem,
} from "@/modules/results/results";

const SQL = { code: "DB", name: "SQL" };
const PY = { code: "ALG", name: "Python" };
const NET = { code: "NET", name: "Желілер" };

function item(position: number, points: number, maxPoints: number, topics = [PY]): ResultItem {
  return { itemId: `i${position}`, position, points, maxPoints, hasAnswer: true, topics };
}

describe("item status", () => {
  it("full points = correct, some = partial, zero = wrong, no answer = empty", () => {
    expect(itemStatus({ points: 2, maxPoints: 2, hasAnswer: true })).toBe("correct");
    expect(itemStatus({ points: 1, maxPoints: 2, hasAnswer: true })).toBe("partial");
    expect(itemStatus({ points: 0, maxPoints: 1, hasAnswer: true })).toBe("wrong");
    expect(itemStatus({ points: 0, maxPoints: 1, hasAnswer: false })).toBe("empty");
  });
});

describe("topic breakdown (FR-09)", () => {
  const items = [item(1, 1, 1, [PY]), item(2, 2, 2, [PY]), item(3, 0, 1, [SQL]), item(4, 1, 2, [SQL]), item(5, 1, 1, [NET])];

  it("computes the percentage of points per topic", () => {
    const rows = Object.fromEntries(topicBreakdown(items).map((t) => [t.code, t.percent]));
    expect(rows).toEqual({ ALG: 100, DB: 33, NET: 100 });
  });

  it("highlights exactly one weakest topic", () => {
    const weakest = topicBreakdown(items).filter((t) => t.weakest);
    expect(weakest).toHaveLength(1);
    expect(weakest[0].code).toBe("DB");
  });

  it("sorts topics from weakest to strongest", () => {
    expect(topicBreakdown(items)[0].code).toBe("DB");
  });

  it("counts an item with two topics in both", () => {
    expect(topicBreakdown([item(1, 1, 1, [PY, SQL])]).map((r) => r.itemCount)).toEqual([1, 1]);
  });

  it("highlights nothing when everything is correct", () => {
    expect(topicBreakdown([item(1, 1, 1, [PY]), item(2, 1, 1, [SQL])]).some((t) => t.weakest)).toBe(false);
  });

  it("on a tie, the topic with more items is the weakest", () => {
    const rows = topicBreakdown([item(1, 0, 1, [PY]), item(2, 0, 1, [SQL]), item(3, 0, 1, [SQL])]);
    expect(rows.find((r) => r.weakest)?.code).toBe("DB");
  });

  it("returns an empty list for no items", () => {
    expect(topicBreakdown([])).toEqual([]);
  });
});

describe("answer formatting", () => {
  const options = [
    { id: "A", text: "1000" },
    { id: "B", text: "1024" },
    { id: "C", text: "512" },
  ];

  it("single choice shows the letter and the text", () => {
    expect(formatResponse("single", { choice: "B" }, options)).toBe("B) 1024");
  });

  it("multiple choice is sorted by letter", () => {
    expect(formatResponse("multiple", { choices: ["C", "A"] }, options)).toBe("A) 1000; C) 512");
  });

  it("matching shows pairs", () => {
    expect(formatResponse("matching", { pairs: { "2": "A", "1": "B" } }, options)).toBe("1 → B, 2 → A");
  });

  it("no answer is shown as a dash", () => {
    expect(formatResponse("single", null, options)).toBe("—");
    expect(formatResponse("multiple", { choices: [] }, options)).toBe("—");
    expect(formatResponse("matching", { pairs: { "1": "" } }, options)).toBe("—");
  });

  it("formats the correct answer the same way", () => {
    expect(formatKey("single", { correct: "B" }, options)).toBe("B) 1024");
    expect(formatKey("multiple", { correct: ["A", "B"] }, options)).toBe("A) 1000; B) 1024");
    expect(formatKey("matching", { correct: { "1": "C" } }, options)).toBe("1 → C");
  });

  it("score percent", () => {
    expect(scorePercent(5, 16)).toBe(31);
    expect(scorePercent(0, 0)).toBe(0);
  });
});
