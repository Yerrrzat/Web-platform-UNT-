import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/modules/auth/password";
import { createSessionToken, verifySessionToken } from "@/modules/auth/token";
import {
  changePasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  toFieldErrors,
} from "@/modules/auth/validation";

const SECRET = "test-secret-that-is-at-least-32-characters";

describe("password hashing (NFR-05)", () => {
  it("stores a hash, not the password, and verifies it", async () => {
    const hash = await hashPassword("Qwerty123");
    expect(hash).not.toContain("Qwerty123");
    expect(await verifyPassword("Qwerty123", hash)).toBe(true);
  });

  it("rejects a wrong password and a missing hash", async () => {
    const hash = await hashPassword("Qwerty123");
    expect(await verifyPassword("qwerty123", hash)).toBe(false);
    expect(await verifyPassword("Qwerty123", null)).toBe(false);
  });

  it("gives different hashes for the same password (salt)", async () => {
    expect(await hashPassword("Qwerty123")).not.toBe(await hashPassword("Qwerty123"));
  });
});

describe("session token (FR-02)", () => {
  it("round-trips the user id and role", async () => {
    const token = await createSessionToken({ sub: "user-1", role: "student" }, SECRET);
    expect(await verifySessionToken(token, SECRET)).toEqual({ sub: "user-1", role: "student" });
  });

  it("rejects a token signed with another secret (forged)", async () => {
    const token = await createSessionToken({ sub: "user-1", role: "admin" }, "another-secret-another-secret-123456");
    expect(await verifySessionToken(token, SECRET)).toBeNull();
  });

  it("rejects an edited token", async () => {
    const token = await createSessionToken({ sub: "user-1", role: "student" }, SECRET);
    const [h, , s] = token.split(".");
    const fakeBody = Buffer.from(JSON.stringify({ sub: "user-1", role: "admin" })).toString("base64url");
    expect(await verifySessionToken(`${h}.${fakeBody}.${s}`, SECRET)).toBeNull();
  });

  it("rejects an expired token and a missing one", async () => {
    const token = await createSessionToken({ sub: "user-1", role: "student" }, SECRET, -10);
    expect(await verifySessionToken(token, SECRET)).toBeNull();
    expect(await verifySessionToken(undefined, SECRET)).toBeNull();
  });

  it("refuses a short secret", async () => {
    await expect(createSessionToken({ sub: "u", role: "student" }, "short")).rejects.toThrow();
  });
});

describe("registration rules (FR-01)", () => {
  const valid = { displayName: "Айгерім", email: " Aigerim@Mail.KZ ", password: "Parol2026", grade: "11", consent: true };

  it("accepts valid data and normalises the email", () => {
    const r = registerSchema.safeParse(valid);
    expect(r.success).toBe(true);
    expect(r.data).toMatchObject({ email: "aigerim@mail.kz", grade: 11 });
  });

  it("grade is optional", () => {
    expect(registerSchema.safeParse({ ...valid, grade: "" }).data?.grade).toBeUndefined();
  });

  it.each([
    ["short password", { password: "Ab1" }, "password"],
    ["password without digits", { password: "Parolparol" }, "password"],
    ["password without letters", { password: "12345678" }, "password"],
    ["bad email", { email: "not-an-email" }, "email"],
    ["grade out of range", { grade: "7" }, "grade"],
    ["no consent", { consent: false }, "consent"],
    ["empty name", { displayName: " " }, "displayName"],
  ])("rejects %s", (_name, change, field) => {
    const r = registerSchema.safeParse({ ...valid, ...change });
    expect(r.success).toBe(false);
    expect(toFieldErrors(r.error!)).toHaveProperty(field);
  });
});

describe("login, profile and password change rules", () => {
  it("login needs an email and a password", () => {
    expect(loginSchema.safeParse({ email: "a@b.kz", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "a@b.kz", password: "" }).success).toBe(false);
  });

  it("profile accepts only kk or ru as language", () => {
    expect(profileSchema.safeParse({ displayName: "Ерлан", grade: "", locale: "ru" }).success).toBe(true);
    expect(profileSchema.safeParse({ displayName: "Ерлан", grade: "", locale: "en" }).success).toBe(false);
  });

  it("new passwords must match", () => {
    const r = changePasswordSchema.safeParse({ current: "Old12345", next: "New12345", repeat: "New12346" });
    expect(r.success).toBe(false);
    expect(toFieldErrors(r.error!)).toHaveProperty("repeat");
  });
});
