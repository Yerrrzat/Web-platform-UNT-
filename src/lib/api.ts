import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/session";
import { SessionError } from "@/modules/session/service";

/** Converts known errors to JSON responses with the right HTTP status. */
export function handleApiError(error: unknown) {
  if (error instanceof SessionError) {
    return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "server_error" }, { status: 500 });
}

export class UnauthorizedError extends Error {}

/** API routes: the logged-in user or 401. */
export async function apiUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
