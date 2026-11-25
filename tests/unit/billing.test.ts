import { describe, expect, it } from "vitest";
import {
  canOpenVersion,
  computePaidUntil,
  isSubscriptionActive,
  PLANS,
  renewalStart,
} from "@/modules/billing/access";

const now = new Date("2026-11-22T10:00:00Z");
const future = new Date("2026-12-22T10:00:00Z");
const past = new Date("2026-10-01T10:00:00Z");

describe("freemium access (FR-11)", () => {
  it("free versions are open to everyone", () => {
    expect(canOpenVersion({ access: "free" }, false)).toBe(true);
  });

  it("premium versions need an active subscription", () => {
    expect(canOpenVersion({ access: "premium" }, false)).toBe(false);
    expect(canOpenVersion({ access: "premium" }, true)).toBe(true);
  });
});

describe("subscription status (FR-12)", () => {
  it("active until the paid date", () => {
    expect(isSubscriptionActive({ status: "active", paidUntil: future }, now)).toBe(true);
    expect(isSubscriptionActive({ status: "active", paidUntil: past }, now)).toBe(false);
  });

  it("a cancelled subscription still works until the paid date", () => {
    expect(isSubscriptionActive({ status: "cancelled", paidUntil: future }, now)).toBe(true);
  });

  it("expired or missing = no access", () => {
    expect(isSubscriptionActive({ status: "expired", paidUntil: future }, now)).toBe(false);
    expect(isSubscriptionActive(null, now)).toBe(false);
  });
});

describe("paid period", () => {
  it("monthly plan = 30 days", () => {
    expect(computePaidUntil("monthly", now).toISOString()).toBe("2026-12-22T10:00:00.000Z");
  });

  it("'until UNT' plan ends on 30 June of the coming season", () => {
    expect(computePaidUntil("until_unt", now).toISOString()).toBe("2027-06-30T23:59:59.000Z");
    expect(computePaidUntil("until_unt", new Date("2027-02-01T00:00:00Z")).toISOString()).toBe(
      "2027-06-30T23:59:59.000Z",
    );
  });

  it("renewing an active subscription continues from its end date", () => {
    expect(renewalStart({ status: "active", paidUntil: future }, now)).toEqual(future);
    expect(renewalStart({ status: "active", paidUntil: past }, now)).toEqual(now);
  });

  it("prices are whole tenge", () => {
    for (const plan of Object.values(PLANS)) expect(Number.isInteger(plan.priceKzt)).toBe(true);
  });
});
