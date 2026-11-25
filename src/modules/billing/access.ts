/** Freemium rules and subscription dates (FR-11, FR-12). Pure functions. */

export type PlanId = "monthly" | "until_unt";

/** Prices are a pilot hypothesis (docs/01): checked by the conversion metric. */
export const PLANS: Record<PlanId, { priceKzt: number; titleKk: string; noteKk: string }> = {
  monthly: { priceKzt: 1990, titleKk: "Ай сайын", noteKk: "30 күн толық қолжетімділік" },
  until_unt: { priceKzt: 9990, titleKk: "ҰБТ-ға дейін", noteKk: "30 маусымға дейін толық қолжетімділік" },
};

export type SubscriptionLike = {
  status: "active" | "expired" | "cancelled";
  paidUntil: Date;
};

/** Cancelled subscriptions keep working until the paid period ends. */
export function isSubscriptionActive(sub: SubscriptionLike | null | undefined, now: Date): boolean {
  if (!sub) return false;
  if (sub.status === "expired") return false;
  return sub.paidUntil.getTime() > now.getTime();
}

/** End of the paid period: +30 days, or 30 June (end of the UNT season). */
export function computePaidUntil(plan: PlanId, from: Date): Date {
  if (plan === "monthly") return new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);
  const year = from.getUTCMonth() >= 6 ? from.getUTCFullYear() + 1 : from.getUTCFullYear();
  return new Date(Date.UTC(year, 5, 30, 23, 59, 59));
}

/** Extending an active subscription starts from its current end, not from today. */
export function renewalStart(current: SubscriptionLike | null | undefined, now: Date): Date {
  return isSubscriptionActive(current, now) ? current!.paidUntil : now;
}

export type VersionAccessInfo = { access: "free" | "premium" };

export function canOpenVersion(version: VersionAccessInfo, hasActiveSubscription: boolean): boolean {
  return version.access === "free" || hasActiveSubscription;
}
