import { NextResponse } from "next/server";
import { apiUser, handleApiError, unauthorized, UnauthorizedError } from "@/lib/api";
import { getAttemptView } from "@/modules/session/service";

/** GET /api/attempts/:id — items without answer keys, saved answers, remaining time */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await apiUser();
    const { id } = await params;
    return NextResponse.json(await getAttemptView(id, user.id));
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    return handleApiError(error);
  }
}
