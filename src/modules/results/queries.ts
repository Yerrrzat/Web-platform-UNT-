import { prisma } from "@/lib/db";
import { formatKey, formatResponse, itemStatus, scorePercent, topicBreakdown } from "./results";

type Option = { id: string; text: string };
type Response = { choice?: string; choices?: string[]; pairs?: Record<string, string> } | null;

function hasAnswer(r: Response): boolean {
  if (!r) return false;
  return Boolean(r.choice || (r.choices && r.choices.length) || (r.pairs && Object.values(r.pairs).some(Boolean)));
}

/**
 * Results of a submitted attempt: score, every item with the student's answer,
 * correct answer and explanation, and the topic breakdown (FR-08, FR-09).
 * Returns null if the attempt does not exist or belongs to someone else.
 */
export async function getAttemptResult(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      version: {
        include: {
          items: {
            orderBy: { position: "asc" },
            include: { topics: { include: { topic: true } } },
          },
        },
      },
      answers: true,
    },
  });
  if (!attempt || attempt.userId !== userId) return null;
  if (!attempt.submittedAt) return { status: "in_progress" as const };

  const answerByItem = new Map(attempt.answers.map((a) => [a.itemId, a]));

  const items = attempt.version.items.map((item) => {
    const answer = answerByItem.get(item.id);
    const response = (answer?.response ?? null) as Response;
    const options = item.options as Option[];
    const points = answer?.points ?? 0;
    const answered = hasAnswer(response);
    return {
      itemId: item.id,
      position: item.position,
      type: item.type,
      body: item.body,
      points,
      maxPoints: item.maxPoints,
      hasAnswer: answered,
      status: itemStatus({ points, maxPoints: item.maxPoints, hasAnswer: answered }),
      yourAnswer: formatResponse(item.type, response, options),
      correctAnswer: formatKey(item.type, item.answerKey as { correct: string }, options),
      explanation: item.explanation,
      topics: item.topics.map((t) => ({ code: t.topic.code, name: t.topic.nameKk })),
    };
  });

  const max = items.reduce((s, i) => s + i.maxPoints, 0);
  const score = attempt.score ?? 0;

  return {
    status: "submitted" as const,
    attemptId: attempt.id,
    versionTitle: attempt.version.title,
    submittedAt: attempt.submittedAt,
    score,
    max,
    percent: scorePercent(score, max),
    items,
    topics: topicBreakdown(items),
  };
}

/** All submitted attempts of the student, oldest first (FR-10). */
export async function getAttemptHistory(userId: string) {
  const attempts = await prisma.attempt.findMany({
    where: { userId, submittedAt: { not: null } },
    orderBy: { submittedAt: "asc" },
    include: { version: { include: { items: { select: { maxPoints: true } } } } },
  });
  return attempts.map((a) => {
    const max = a.version.items.reduce((s, i) => s + i.maxPoints, 0);
    return {
      attemptId: a.id,
      versionTitle: a.version.title,
      submittedAt: a.submittedAt!,
      score: a.score ?? 0,
      max,
      percent: scorePercent(a.score ?? 0, max),
    };
  });
}
