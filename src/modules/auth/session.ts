import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_TTL_SECONDS, verifySessionToken } from "./token";

/** Cookie-based login session. */

export const SESSION_COOKIE = "session";

function secret() {
  return process.env.AUTH_SECRET ?? "";
}

export async function setSessionCookie(user: { id: string; role: "student" | "admin" }) {
  const token = await createSessionToken({ sub: user.id, role: user.role }, secret());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

/** The logged-in user, or null. */
export async function getCurrentUser() {
  const store = await cookies();
  const payload = await verifySessionToken(store.get(SESSION_COOKIE)?.value, secret());
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.sub } });
}

/** For pages: sends guests to the login page and brings them back afterwards. */
export async function requireUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function requireAdmin(returnTo: string) {
  const user = await requireUser(returnTo);
  if (user.role !== "admin") redirect("/");
  return user;
}
