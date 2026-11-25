import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { canOpenVersion } from "@/modules/billing/access";
import { hasActiveSubscription } from "@/modules/billing/service";
import { trackEvent } from "@/modules/events/track";
import { scoreAttempt, type AnswerKey, type ItemResponse, type ItemType } from "@/modules/scoring";
import { canSaveAnswer, computeDeadline, isExpired, remainingSeconds, toPublicItem } from "./rules";

/** Test session: start, resume, autosave, submit (FR-05, FR-06, NFR-02, NFR-04). */

export class SessionError extends Error {
  constructor(
    public code:
      | "not_found"
      | "forbidden"
      | "submitted"
      | "expired"
      | "bad_request"
      | "subscription_required",
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type Option = { id: string; text: string };

const singleSchema = z.object({ choice: z.string().min(1) });
const multipleSchema = z.object({ choices: z.array(z.string()).max(10) });
const matchingSchema = z.object({ pairs: z.record(z.string(), z.string()) });

/** Checks the answer format and that all option ids exist in the item. */
export function parseResponse(type: ItemType, options: unknown, raw: unknown): ItemResponse {
  const ids = new Set((options as Option[]).map((o) => o.id));
  function fail(): never {
    throw new SessionError("bad_request", 400, "Invalid answer format");
  }
  if (type === "single" || type === "context") {
    const r = singleSchema.safeParse(raw);
    if (!r.success || !ids.has(r.data.choice)) fail();
    return r.data;
  }
  if (type === "multiple") {
    const r = multipleSchema.safeParse(raw);
    if (!r.success || r.data.choices.some((c) => !ids.has(c))) fail();
    return { choices: [...new Set(r.data.choices)] };
  }
  const r = matchingSchema.safeParse(raw);
  if (!r.success || Object.values(r.data.pairs).some((v) => v !== "" && !ids.has(v))) fail();
  return r.data;
}

async function loadOwnAttempt(attemptId: string, userId: string) {
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } });
  if (!attempt) throw new SessionError("not_found", 404, "Attempt not found");
  if (attempt.userId !== userId) throw new SessionError("forbidden", 403, "Not your attempt");
  return attempt;
}

/** Starts a new attempt, or resumes an open one for the same version. Premium needs a subscription. */
export async function startAttempt(userId: string, versionId: string, now = new Date()) {
  const version = await prisma.testVersion.findUnique({ where: { id: versionId } });
  if (!version || version.status !== "published") {
    throw new SessionError("not_found", 404, "Version not found");
  }
  if (!canOpenVersion(version, await hasActiveSubscription(userId, now))) {
    throw new SessionError("subscription_required", 402, "Subscription required");
  }

  const open = await prisma.attempt.findFirst({
    where: { userId, versionId, submittedAt: null, deadlineAt: { gt: now } },
    orderBy: { startedAt: "desc" },
  });
  if (open) return { attempt: open, resumed: true };

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      versionId,
      startedAt: now,
      deadlineAt: computeDeadline(now, version.timeLimitMin),
    },
  });
  await trackEvent("test_start", userId, { attemptId: attempt.id, versionId });
  return { attempt, resumed: false };
}

/** What the test page needs: items WITHOUT answer keys, saved answers, time left. */
export async function getAttemptView(attemptId: string, userId: string, now = new Date()) {
  let attempt = await loadOwnAttempt(attemptId, userId);

  // Deadline passed while the student was away: submit automatically
  if (!attempt.submittedAt && isExpired(attempt.deadlineAt, now)) {
    await submitAttempt(attemptId, userId, now);
    attempt = await loadOwnAttempt(attemptId, userId);
  }

  const version = await prisma.testVersion.findUniqueOrThrow({
    where: { id: attempt.versionId },
    include: { items: { orderBy: { position: "asc" } } },
  });
  const answers = await prisma.answer.findMany({ where: { attemptId } });

  return {
    attemptId: attempt.id,
    version: { id: version.id, number: version.number, title: version.title },
    status: attempt.submittedAt ? ("submitted" as const) : ("in_progress" as const),
    score: attempt.score,
    maxScore: version.items.reduce((s, i) => s + i.maxPoints, 0),
    serverNow: now.toISOString(),
    deadlineAt: attempt.deadlineAt.toISOString(),
    remainingSeconds: attempt.submittedAt ? 0 : remainingSeconds(attempt.deadlineAt, now),
    items: version.items.map(toPublicItem),
    answers: answers.map((a) => ({ itemId: a.itemId, response: a.response, flagged: a.flagged })),
  };
}

/** Autosave of one answer (upsert). Rejected after submit or after the deadline. */
export async function saveAnswer(
  attemptId: string,
  userId: string,
  input: { itemId: string; response?: unknown; flagged?: boolean },
  now = new Date(),
) {
  const attempt = await loadOwnAttempt(attemptId, userId);
  const check = canSaveAnswer(attempt, now);
  if (!check.ok) {
    throw new SessionError(
      check.reason,
      409,
      check.reason === "submitted" ? "Attempt already submitted" : "Time is over",
    );
  }

  const item = await prisma.item.findUnique({ where: { id: input.itemId } });
  if (!item || item.versionId !== attempt.versionId) {
    throw new SessionError("bad_request", 400, "Item does not belong to this attempt");
  }

  // undefined = do not change the answer, null = clear it
  let response: Prisma.InputJsonValue | typeof Prisma.DbNull | undefined;
  if (input.response === null) response = Prisma.DbNull;
  else if (input.response !== undefined) {
    response = parseResponse(item.type, item.options, input.response) as Prisma.InputJsonValue;
  }

  const saved = await prisma.answer.upsert({
    where: { attemptId_itemId: { attemptId, itemId: item.id } },
    create: {
      attemptId,
      itemId: item.id,
      response: response ?? Prisma.DbNull,
      flagged: input.flagged ?? false,
    },
    update: {
      ...(response !== undefined ? { response } : {}),
      ...(input.flagged !== undefined ? { flagged: input.flagged } : {}),
    },
  });
  return { itemId: saved.itemId, savedAt: saved.updatedAt.toISOString() };
}

/** Scores the attempt with the UNT rules and stores points. Safe to call twice. */
export async function submitAttempt(attemptId: string, userId: string, now = new Date()) {
  const attempt = await loadOwnAttempt(attemptId, userId);
  const items = await prisma.item.findMany({ where: { versionId: attempt.versionId } });
  const max = items.reduce((s, i) => s + i.maxPoints, 0);
  if (attempt.submittedAt) return { score: attempt.score ?? 0, max, alreadySubmitted: true };

  const answers = await prisma.answer.findMany({ where: { attemptId } });
  const responses = new Map(answers.map((a) => [a.itemId, a.response as ItemResponse | null]));

  const result = scoreAttempt(
    items.map((i) => ({
      id: i.id,
      type: i.type,
      answerKey: i.answerKey as AnswerKey,
      maxPoints: i.maxPoints,
    })),
    responses,
  );

  await prisma.$transaction([
    // store points for every item, including unanswered ones (0)
    ...result.items.map((s) =>
      prisma.answer.upsert({
        where: { attemptId_itemId: { attemptId, itemId: s.itemId } },
        create: { attemptId, itemId: s.itemId, points: s.points },
        update: { points: s.points },
      }),
    ),
    prisma.attempt.update({
      where: { id: attemptId },
      data: { submittedAt: now, score: result.total },
    }),
  ]);

  await trackEvent("test_finish", userId, {
    attemptId,
    versionId: attempt.versionId,
    score: result.total,
    max: result.max,
  });
  return { score: result.total, max: result.max, alreadySubmitted: false };
}
