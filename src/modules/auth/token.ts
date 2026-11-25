import { jwtVerify, SignJWT } from "jose";

/**
 * Signed session token stored in an httpOnly cookie (FR-02).
 * HS256 with AUTH_SECRET; contains only the user id and role.
 */
export type SessionPayload = { sub: string; role: "student" | "admin" };

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function key(secret: string) {
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload,
  secret: string,
  ttlSeconds = SESSION_TTL_SECONDS,
): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(key(secret));
}

/** Returns the payload, or null if the token is missing, forged or expired. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    if (!payload.sub || (payload.role !== "student" && payload.role !== "admin")) return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
