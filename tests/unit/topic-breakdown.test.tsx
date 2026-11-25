// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TopicBreakdown } from "@/components/TopicBreakdown";
import { topicBreakdown } from "@/modules/results/results";

afterEach(cleanup);

describe("TopicBreakdown component", () => {
  const topics = topicBreakdown([
    { itemId: "1", position: 1, points: 1, maxPoints: 1, hasAnswer: true, topics: [{ code: "ALG", name: "Python" }] },
    { itemId: "2", position: 2, points: 0, maxPoints: 2, hasAnswer: true, topics: [{ code: "DB", name: "SQL" }] },
  ]);

  it("shows every topic with its percentage", () => {
    render(<TopicBreakdown topics={topics} />);
    expect(screen.getByText("Python")).toBeTruthy();
    expect(screen.getByText("SQL")).toBeTruthy();
    expect(screen.getByText(/100%/)).toBeTruthy();
    expect(screen.getByText(/^0%/)).toBeTruthy();
  });

  it("highlights the weakest topic", () => {
    render(<TopicBreakdown topics={topics} />);
    const weakest = screen.getByTestId("weakest-topic");
    expect(weakest.textContent).toContain("SQL");
    expect(weakest.className).toContain("weakest");
  });
});
