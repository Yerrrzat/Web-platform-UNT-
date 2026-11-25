// Shared item and answer formats (stored as JSON in items.answer_key and answers.response)

export type ItemType = "single" | "multiple" | "matching" | "context";

/** single / context: one option id, e.g. { choice: "B" } */
export type SingleResponse = { choice: string };
/** multiple: several option ids, e.g. { choices: ["A", "C"] } */
export type MultipleResponse = { choices: string[] };
/** matching: left id -> right option id, e.g. { pairs: { "1": "B", "2": "A" } } */
export type MatchingResponse = { pairs: Record<string, string> };

export type ItemResponse = SingleResponse | MultipleResponse | MatchingResponse;

export type SingleKey = { correct: string };
export type MultipleKey = { correct: string[] };
export type MatchingKey = { correct: Record<string, string> };

export type AnswerKey = SingleKey | MultipleKey | MatchingKey;

export type ScorableItem = {
  id: string;
  type: ItemType;
  answerKey: AnswerKey;
  maxPoints: number;
};

export type ItemScore = {
  itemId: string;
  points: number;
  maxPoints: number;
  /** correct = full points, partial = some points, wrong = 0 with an answer, empty = no answer */
  status: "correct" | "partial" | "wrong" | "empty";
};

export type AttemptScore = {
  total: number;
  max: number;
  items: ItemScore[];
};
