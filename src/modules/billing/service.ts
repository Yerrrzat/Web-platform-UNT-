import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/modules/events/track";
import { computePaidUntil, isSubscriptionActive, PLANS, renewalStart, type PlanId } from "./access";

/**
 * Subscriptions and payments (FR-11, FR-12).
 * PAYMENT_PROVIDER="test": the payment is simulated, no money is charged.
 * A real Kazakhstan payment provider plugs in behind startCheckout (UNT-22).
 */

export class BillingError extends Error {
  constructor(public code: "provider_not_configured", message: string) {
    super(message);
  }
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId },
    orderBy: { paidUntil: "desc" },
  });
}

export async function hasActiveSubscription(userId: string, now = new Date()) {
  return isSubscriptionActive(await getSubscription(userId), now);
}

export async function listPayments(userId: string) {
  return prisma.payment.findMany({
    where: { subscription: { userId } },
    orderBy: { createdAt: "desc" },
    include: { subscription: { select: { plan: true } } },
  });
}

/** Test-mode checkout: records a succeeded payment and activates (or extends) the subscription. */
export async function startTestCheckout(userId: string, plan: PlanId, now = new Date()) {
  if ((process.env.PAYMENT_PROVIDER ?? "test") !== "test") {
    throw new BillingError("provider_not_configured", "Payment provider is not connected yet");
  }
  await trackEvent("checkout_start", userId, { plan });

  const current = await getSubscription(userId);
  const paidUntil = computePaidUntil(plan, renewalStart(current, now));
  const amountKzt = PLANS[plan].priceKzt;

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: "active",
      paidUntil,
      providerRef: "test",
      createdAt: now,
      payments: {
        create: {
          amountKzt,
          status: "succeeded",
          providerEventId: `test_${randomUUID()}`,
          createdAt: now,
        },
      },
    },
  });
  await trackEvent("payment", userId, { plan, amountKzt });
  return subscription;
}

/** Stops renewal; access stays until paidUntil. */
export async function cancelSubscription(userId: string) {
  const current = await getSubscription(userId);
  if (!current || current.status !== "active") return null;
  return prisma.subscription.update({ where: { id: current.id }, data: { status: "cancelled" } });
}
