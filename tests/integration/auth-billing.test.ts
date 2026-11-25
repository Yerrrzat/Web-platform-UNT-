import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { AuthError, authenticate, changePassword, registerUser, updateProfile } from "@/modules/auth/service";
import {
  cancelSubscription,
  getSubscription,
  hasActiveSubscription,
  listPayments,
  startTestCheckout,
} from "@/modules/billing/service";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("account and subscription (PostgreSQL)", () => {
  const email = `it-auth-${Date.now()}@test.local`;
  let userId = "";

  afterAll(async () => {
    await prisma.event.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it("registers a student with a hashed password and a registration event", async () => {
    const user = await registerUser({ displayName: "Тест Оқушы", email, password: "Parol2026", grade: 11 });
    userId = user.id;
    expect(user.passwordHash).not.toBe("Parol2026");
    expect(user.role).toBe("student");
    expect(await prisma.event.count({ where: { userId, name: "registration" } })).toBe(1);
  });

  it("refuses a second account with the same email", async () => {
    await expect(registerUser({ displayName: "Copy", email, password: "Parol2026" })).rejects.toMatchObject({
      code: "email_taken",
    });
  });

  it("logs in with the right password only (same error for unknown email)", async () => {
    expect((await authenticate(email, "Parol2026")).id).toBe(userId);
    await expect(authenticate(email, "Wrong1234")).rejects.toBeInstanceOf(AuthError);
    await expect(authenticate("nobody@test.local", "Parol2026")).rejects.toMatchObject({ code: "invalid_credentials" });
  });

  it("updates the profile and changes the password", async () => {
    const updated = await updateProfile(userId, { displayName: "Жаңа Аты", grade: 10, locale: "ru" });
    expect(updated).toMatchObject({ displayName: "Жаңа Аты", grade: 10, locale: "ru" });

    await expect(changePassword(userId, "Wrong1234", "NewPass2026")).rejects.toMatchObject({ code: "wrong_password" });
    await changePassword(userId, "Parol2026", "NewPass2026");
    expect((await authenticate(email, "NewPass2026")).id).toBe(userId);
  });

  it("test checkout activates the subscription and records the payment", async () => {
    expect(await hasActiveSubscription(userId)).toBe(false);
    await startTestCheckout(userId, "monthly");
    expect(await hasActiveSubscription(userId)).toBe(true);
    const payments = await listPayments(userId);
    expect(payments).toHaveLength(1);
    expect(payments[0]).toMatchObject({ amountKzt: 1990, status: "succeeded" });
    expect(await prisma.event.count({ where: { userId, name: "payment" } })).toBe(1);
  });

  it("paying again extends from the current end date", async () => {
    const first = (await getSubscription(userId))!.paidUntil;
    await startTestCheckout(userId, "monthly");
    const second = (await getSubscription(userId))!.paidUntil;
    expect(second.getTime() - first.getTime()).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it("cancelling keeps access until the end of the paid period", async () => {
    await cancelSubscription(userId);
    const sub = await getSubscription(userId);
    expect(sub?.status).toBe("cancelled");
    expect(await hasActiveSubscription(userId)).toBe(true);
    expect(await hasActiveSubscription(userId, new Date(sub!.paidUntil.getTime() + 1000))).toBe(false);
  });
});
