import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { trackEvent } from "@/modules/events/track";
import { hashPassword, verifyPassword } from "./password";

/** Registration, login and profile changes (FR-01, FR-02). */

export class AuthError extends Error {
  constructor(
    public code: "email_taken" | "invalid_credentials" | "wrong_password",
    message: string,
  ) {
    super(message);
  }
}

export async function registerUser(input: {
  displayName: string;
  email: string;
  password: string;
  grade?: number;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        grade: input.grade ?? null,
        passwordHash: await hashPassword(input.password),
      },
    });
    await trackEvent("registration", user.id);
    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new AuthError("email_taken", "Бұл email тіркелген");
    }
    throw e;
  }
}

/** Same error for unknown email and wrong password, so emails cannot be guessed. */
export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AuthError("invalid_credentials", "Email немесе құпиясөз қате");
  }
  await trackEvent("login", user.id);
  return user;
}

export async function updateProfile(
  userId: string,
  data: { displayName: string; grade?: number; locale: "kk" | "ru" },
) {
  return prisma.user.update({
    where: { id: userId },
    data: { displayName: data.displayName, grade: data.grade ?? null, locale: data.locale },
  });
}

export async function changePassword(userId: string, current: string, next: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!(await verifyPassword(current, user.passwordHash))) {
    throw new AuthError("wrong_password", "Қазіргі құпиясөз қате");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(next) },
  });
}
