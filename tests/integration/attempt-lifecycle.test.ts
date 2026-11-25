import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { startTestCheckout } from "@/modules/billing/service";
import { getAttemptView, saveAnswer, SessionError, startAttempt, submitAttempt } from "@/modules/session/service";

// Runs against a real PostgreSQL (DATABASE_URL). Skipped when no database is configured.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("test session (PostgreSQL)", () => {
  let userId = "";
  let versionId = "";
  let premiumId = "";
  const itemIds: Record<string, string> = {};
  const n = 90000 + Math.floor(Math.random() * 9000);

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: { email: `it-session-${Date.now()}@test.local`, displayName: "Integration test" },
    });
    userId = user.id;
    const version = await prisma.testVersion.create({
      data: {
        number: n,
        title: "Integration free version",
        status: "published",
        timeLimitMin: 10,
        items: {
          create: [
            {
              position: 1,
              type: "single",
              body: { text: "2 + 2 = ?" },
              options: [
                { id: "A", text: "3" },
                { id: "B", text: "4" },
              ],
              answerKey: { correct: "B" },
              explanation: "2 + 2 = 4",
              maxPoints: 1,
            },
            {
              position: 2,
              type: "multiple",
              body: { text: "Even numbers" },
              options: [
                { id: "A", text: "2" },
                { id: "B", text: "3" },
                { id: "C", text: "4" },
              ],
              answerKey: { correct: ["A", "C"] },
              explanation: "2 and 4",
              maxPoints: 2,
            },
          ],
        },
      },
      include: { items: true },
    });
    versionId = version.id;
    for (const i of version.items) itemIds[i.position] = i.id;
    const premium = await prisma.testVersion.create({
      data: { number: n + 1, title: "Integration premium version", status: "published", access: "premium", timeLimitMin: 10 },
    });
    premiumId = premium.id;
  });

  afterAll(async () => {
    await prisma.testVersion.deleteMany({ where: { id: { in: [versionId, premiumId] } } });
    await prisma.event.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("start → autosave → reload → submit gives the UNT score", async () => {
    const { attempt, resumed } = await startAttempt(userId, versionId);
    expect(resumed).toBe(false);

    const again = await startAttempt(userId, versionId);
    expect(again.resumed).toBe(true);
    expect(again.attempt.id).toBe(attempt.id);

    await saveAnswer(attempt.id, userId, { itemId: itemIds[1], response: { choice: "B" } });
    await saveAnswer(attempt.id, userId, { itemId: itemIds[2], response: { choices: ["A"] } });
    // changing an answer overwrites it (upsert), it does not create a second row
    await saveAnswer(attempt.id, userId, { itemId: itemIds[2], response: { choices: ["A", "C"] } });

    const view = await getAttemptView(attempt.id, userId);
    expect(view.answers).toHaveLength(2);
    expect(view.remainingSeconds).toBeGreaterThan(0);
    expect(JSON.stringify(view.items)).not.toContain("correct");

    expect(await submitAttempt(attempt.id, userId)).toMatchObject({ score: 3, max: 3, alreadySubmitted: false });
    expect((await submitAttempt(attempt.id, userId)).alreadySubmitted).toBe(true);
  });

  it("rejects answers after the deadline with 409", async () => {
    const { attempt } = await startAttempt(userId, versionId);
    const afterDeadline = new Date(attempt.deadlineAt.getTime() + 60_000);
    await expect(
      saveAnswer(attempt.id, userId, { itemId: itemIds[1], response: { choice: "A" } }, afterDeadline),
    ).rejects.toMatchObject({ code: "expired", status: 409 });
  });

  it("submits automatically when the student opens an expired attempt", async () => {
    const { attempt } = await startAttempt(userId, versionId);
    const view = await getAttemptView(attempt.id, userId, new Date(attempt.deadlineAt.getTime() + 1000));
    expect(view.status).toBe("submitted");
    expect(view.score).toBe(0);
  });

  it("rejects an option id that does not exist in the item", async () => {
    const other = await prisma.attempt.create({
      data: { userId, versionId, deadlineAt: new Date(Date.now() + 600_000) },
    });
    await expect(
      saveAnswer(other.id, userId, { itemId: itemIds[1], response: { choice: "Z" } }),
    ).rejects.toBeInstanceOf(SessionError);
  });

  it("another student cannot open someone else's attempt", async () => {
    const stranger = await prisma.user.create({ data: { email: `it-stranger-${Date.now()}@test.local`, displayName: "x" } });
    const own = await prisma.attempt.create({ data: { userId, versionId, deadlineAt: new Date(Date.now() + 600_000) } });
    await expect(getAttemptView(own.id, stranger.id)).rejects.toMatchObject({ code: "forbidden", status: 403 });
    await prisma.user.delete({ where: { id: stranger.id } });
  });

  it("premium version: 402 without a subscription, opens after payment", async () => {
    await expect(startAttempt(userId, premiumId)).rejects.toMatchObject({ code: "subscription_required", status: 402 });
    await startTestCheckout(userId, "monthly");
    const { attempt } = await startAttempt(userId, premiumId);
    expect(attempt.versionId).toBe(premiumId);
  });
});
