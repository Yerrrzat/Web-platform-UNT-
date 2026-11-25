import { getEventsForExport } from "@/modules/analytics/queries";
import { toCsv } from "@/modules/analytics/csv";
import { getCurrentUser } from "@/modules/auth/session";

/** GET /api/admin/events?days=30 — events as CSV for the conversion funnel (FR-16), admins only */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return new Response("Forbidden", { status: 403 });

  const days = new URL(request.url).searchParams.get("days") === "7" ? 7 : 30;
  const events = await getEventsForExport(days);
  const csv = toCsv(
    ["id", "user_id", "name", "props", "created_at"],
    events.map((e) => [
      e.id.toString(),
      e.userId ?? "",
      e.name,
      JSON.stringify(e.props),
      e.createdAt.toISOString(),
    ]),
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="events-${days}d.csv"`,
    },
  });
}
