import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, handleApiError, unauthorized, UnauthorizedError } from "@/lib/api";
import { startAttempt } from "@/modules/session/service";

const bodySchema = z.object({ versionId: z.string().uuid() });

/** POST /api/attempts — start (or resume) a test attempt */
export async function POST(request: Request) {
  try {
    const user = await apiUser();
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const { attempt, resumed } = await startAttempt(user.id, parsed.data.versionId);
    return NextResponse.json({ attemptId: attempt.id, resumed }, { status: resumed ? 200 : 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    return handleApiError(error);
  }
}
