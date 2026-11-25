import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Product analytics events (FR-16). */
export type EventName =
  | "registration"
  | "login"
  | "test_start"
  | "test_finish"
  | "paywall_view"
  | "checkout_start"
  | "payment";

export async function trackEvent(
  name: EventName,
  userId: string | null,
  props: Record<string, unknown> = {},
) {
  await prisma.event.create({
    data: { name, userId, props: props as Prisma.InputJsonValue },
  });
}
