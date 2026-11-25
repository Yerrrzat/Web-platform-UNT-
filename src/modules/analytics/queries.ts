import { prisma } from "@/lib/db";
import {
  activationRate,
  averageScorePercent,
  completionRate,
  conversionRate,
  dailyAverageScore,
  funnel,
  periodStart,
  scoreGrowth,
} from "./metrics";

/** Data for the admin dashboard for the last `days` days (FR-17). */
export async function getDashboard(days: number, now = new Date()) {
  const from = periodStart(now, days);

  const [students, attempts, events, maxByVersion] = await Promise.all([
    prisma.user.findMany({
      where: { role: "student", createdAt: { gte: from } },
      select: { id: true, createdAt: true },
    }),
    prisma.attempt.findMany({
      where: { startedAt: { gte: from } },
      select: { userId: true, versionId: true, startedAt: true, submittedAt: true, score: true },
    }),
    prisma.event.findMany({
      where: { createdAt: { gte: from } },
      select: { name: true, userId: true, createdAt: true },
    }),
    prisma.item.groupBy({ by: ["versionId"], _sum: { maxPoints: true } }),
  ]);

  const maxScore = new Map(maxByVersion.map((m) => [m.versionId, m._sum.maxPoints ?? 0]));
  const rows = attempts.map((a) => ({ ...a, maxScore: maxScore.get(a.versionId) ?? 0 }));

  return {
    days,
    students: students.length,
    attempts: rows.length,
    submitted: rows.filter((a) => a.submittedAt).length,
    activation: activationRate(students, rows),
    completion: completionRate(rows),
    averageScore: averageScorePercent(rows),
    growth: scoreGrowth(rows),
    conversion: conversionRate(events),
    funnel: funnel(events),
    daily: dailyAverageScore(rows, days, now),
  };
}

/** All events of the period for CSV export (FR-16). User IDs are pseudonymous UUIDs. */
export async function getEventsForExport(days: number, now = new Date()) {
  return prisma.event.findMany({
    where: { createdAt: { gte: periodStart(now, days) } },
    orderBy: { createdAt: "asc" },
  });
}
