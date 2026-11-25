import { NextResponse } from "next/server";
import { apiUser, handleApiError, unauthorized, UnauthorizedError } from "@/lib/api";
import { submitAttempt } from "@/modules/session/service";

/** POST /api/attempts/:id/submit — finish the test and score it with UNT rules */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await apiUser();
    const { id } = await params;
    return NextResponse.json(await submitAttempt(id, user.id));
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    return handleApiError(error);
  }
}
