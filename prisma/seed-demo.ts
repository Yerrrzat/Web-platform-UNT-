/**
 * Demo pilot data for the analytics dashboard:
 * 15 students, ~40 attempts over the last 25 days, analytics events.
 * Run after the main seed: npm run db:seed-demo
 * Safe to run again: old demo data is removed first.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scoreItem, type AnswerKey, type ItemResponse } from "../src/modules/scoring";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const DEMO_DOMAIN = "demo.unt.kz";
const DAY = 24 * 60 * 60 * 1000;

// deterministic random numbers, so the demo looks the same every time
let seed = 2026;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}

type Option = { id: string; text: string };
type DbItem = {
  id: string;
  type: "single" | "multiple" | "matching" | "context";
  options: Option[];
  answerKey: AnswerKey;
  maxPoints: number;
};

/** Builds an answer that is correct with probability `skill`, otherwise has mistakes. */
function makeResponse(item: DbItem, skill: number): ItemResponse | null {
  if (rand() < 0.05) return null; // skipped item
  const ok = rand() < skill;
  const ids = item.options.map((o) => o.id);
  if (item.type === "single" || item.type === "context") {
    const correct = (item.answerKey as { correct: string }).correct;
    if (ok) return { choice: correct };
    const wrong = ids.filter((i) => i !== correct);
    return { choice: wrong[Math.floor(rand() * wrong.length)] };
  }
  if (item.type === "multiple") {
    const correct = (item.answerKey as { correct: string[] }).correct;
    if (ok) return { choices: [...correct] };
    return rand() < 0.5
      ? { choices: correct.slice(1) }
      : { choices: [...correct.slice(1), ids.find((i) => !correct.includes(i))!] };
  }
  const correct = (item.answerKey as { correct: Record<string, string> }).correct;
  if (ok) return { pairs: { ...correct } };
  const keys = Object.keys(correct);
  const pairs = { ...correct };
  pairs[keys[0]] = correct[keys[1]]; // one wrong pair, sometimes two
  if (rand() < 0.5) pairs[keys[1]] = correct[keys[0]];
  return { pairs };
}

async function main() {
  const now = new Date();
  const version = await prisma.testVersion.findUnique({
    where: { number: 1 },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!version) throw new Error("Run the main seed first: npm run db:seed");
  const items = version.items as unknown as DbItem[];

  // remove old demo data
  const old = await prisma.user.findMany({ where: { email: { endsWith: `@${DEMO_DOMAIN}` } } });
  await prisma.event.deleteMany({ where: { userId: { in: old.map((u) => u.id) } } });
  await prisma.user.deleteMany({ where: { id: { in: old.map((u) => u.id) } } });

  let attemptCount = 0;
  const events: Prisma.EventCreateManyInput[] = [];

  async function addAttempt(userId: string, startedAt: Date, skill: number, submitted: boolean) {
    const deadlineAt = new Date(startedAt.getTime() + version!.timeLimitMin * 60_000);
    const submittedAt = submitted ? new Date(startedAt.getTime() + (8 + rand() * 10) * 60_000) : null;
    const answers = items.map((item) => {
      const response = makeResponse(item, skill);
      return { item, response, points: scoreItem(item, response).points };
    });
    const score = answers.reduce((s, a) => s + a.points, 0);
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        versionId: version!.id,
        startedAt,
        deadlineAt,
        submittedAt,
        score: submitted ? score : null,
        answers: {
          create: answers.map((a) => ({
            itemId: a.item.id,
            response: (a.response ?? undefined) as Prisma.InputJsonValue | undefined,
            points: submitted ? a.points : null,
          })),
        },
      },
    });
    attemptCount++;
    events.push({ name: "test_start", userId, createdAt: startedAt, props: { attemptId: attempt.id } });
    if (submittedAt) {
      events.push({ name: "test_finish", userId, createdAt: submittedAt, props: { attemptId: attempt.id, score } });
    }
  }

  for (let s = 1; s <= 15; s++) {
    const createdAt = new Date(now.getTime() - (25 - Math.floor(rand() * 24)) * DAY);
    const user = await prisma.user.create({
      data: {
        email: `student${s}@${DEMO_DOMAIN}`,
        displayName: `Оқушы ${s}`,
        grade: rand() < 0.6 ? 11 : 10,
        createdAt,
      },
    });
    events.push({ name: "registration", userId: user.id, createdAt, props: {} });

    if (s > 12) continue; // 3 students never start a test (activation < 100%)
    const tests = 1 + Math.floor(rand() * 5);
    const baseSkill = 0.35 + rand() * 0.3;
    for (let k = 0; k < tests; k++) {
      const daysAfter = Math.min((now.getTime() - createdAt.getTime()) / DAY - 0.5, 1 + k * 3);
      const startedAt = new Date(createdAt.getTime() + daysAfter * DAY + rand() * 3_600_000);
      const submitted = rand() > 0.12; // most attempts are finished
      await addAttempt(user.id, startedAt, Math.min(0.95, baseSkill + k * 0.08), submitted);
    }
    if (rand() < 0.5) {
      events.push({ name: "paywall_view", userId: user.id, createdAt: new Date(createdAt.getTime() + 2 * DAY), props: {} });
    }
    if (s === 2 || s === 5) {
      events.push({ name: "checkout_start", userId: user.id, createdAt: new Date(createdAt.getTime() + 3 * DAY), props: {} });
    }
    if (s === 2) {
      events.push({ name: "payment", userId: user.id, createdAt: new Date(createdAt.getTime() + 3 * DAY), props: { amountKzt: 1990 } });
    }
  }

  await prisma.event.createMany({ data: events });
  console.log(`Demo data: 15 students, ${attemptCount} attempts, ${events.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
