import { prisma } from "@/lib/db";
import { canOpenVersion } from "@/modules/billing/access";

/** Published versions for the catalogue, with a lock for premium ones (FR-03, FR-11). */
export async function listPublishedVersions(hasSubscription: boolean) {
  const versions = await prisma.testVersion.findMany({
    where: { status: "published" },
    orderBy: { number: "asc" },
    include: { items: { select: { maxPoints: true } } },
  });
  return versions.map((v) => ({
    id: v.id,
    number: v.number,
    title: v.title,
    access: v.access,
    timeLimitMin: v.timeLimitMin,
    itemCount: v.items.length,
    maxScore: v.items.reduce((s, i) => s + i.maxPoints, 0),
    locked: !canOpenVersion({ access: v.access }, hasSubscription),
  }));
}
