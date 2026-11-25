import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser, handleApiError, unauthorized, UnauthorizedError } from "@/lib/api";
import { saveAnswer } from "@/modules/session/service";

const bodySchema = z.object({
  itemId: z.string().uuid(),
  response: z.unknown().optional(),
  flagged: z.boolean().optional(),
});

/** PUT /api/attempts/:id/answers — autosave one answer (409 after deadline or submit) */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await apiUser();
    const { id } = await params;
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    return NextResponse.json(await saveAnswer(id, user.id, parsed.data));
  } catch (error) {
    if (error instanceof UnauthorizedError) return unauthorized();
    return handleApiError(error);
  }
}
