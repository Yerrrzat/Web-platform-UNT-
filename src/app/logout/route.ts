import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/modules/auth/session";

/** POST /logout — ends the session and returns to the catalogue */
export async function POST(request: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
