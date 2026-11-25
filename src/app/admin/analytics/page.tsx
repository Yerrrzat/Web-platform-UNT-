import Link from "next/link";
import { LineChart } from "@/components/LineChart";
import { StatCard } from "@/components/StatCard";
import { kk } from "@/i18n/kk";
import { getDashboard } from "@/modules/analytics/queries";
import { requireAdmin } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

const t = kk.analytics;
const PERIODS = [7, 30] as const;

function percent(v: number | null) {
  return v === null ? t.noData : `${v}%`;
}

/** Pilot metrics dashboard (FR-17), admins only. */
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  await requireAdmin("/admin/analytics");
  const { days: raw } = await searchParams;
  const days = raw === "7" ? 7 : 30;
  const d = await getDashboard(days);
  const maxFunnel = Math.max(1, ...d.funnel.map((f) => f.users));

  return (
    <>
      <div className="runner-top">
        <h1 style={{ margin: 0 }}>{t.title}</h1>
        <div className="period-switch">
          {PERIODS.map((p) => (
            <Link key={p} className={`btn ${p === days ? "" : "btn-secondary"}`} href={`?days=${p}`}>
              {p} {t.days}
            </Link>
          ))}
        </div>
      </div>

      <div className="stats">
        <StatCard title={t.students} value={String(d.students)} />
        <StatCard title={t.attempts} value={String(d.attempts)} />
        <StatCard title={t.activation} value={percent(d.activation)} hint={t.activationHint} target={`${t.target}: 50%`} />
        <StatCard title={t.completion} value={percent(d.completion)} hint={t.completionHint} target={`${t.target}: 70%`} />
        <StatCard title={t.averageScore} value={percent(d.averageScore)} hint={t.averageScoreHint} />
        <StatCard
          title={t.growth}
          value={d.growth.average === null ? t.noData : `${d.growth.average > 0 ? "+" : ""}${d.growth.average} ${t.pp}`}
          hint={`${t.growthHint} · ${d.growth.students} ${t.basedOn}`}
          target={`${t.target}: +10 ${t.pp}`}
        />
        <StatCard title={t.conversion} value={percent(d.conversion)} hint={t.conversionHint} target={`${t.target}: 3%`} />
      </div>

      <section className="card section">
        <h2 style={{ marginTop: 0 }}>{t.dailyTitle}</h2>
        <LineChart points={d.daily.map((p) => ({ label: p.day.slice(5), value: p.value }))} />
      </section>

      <section className="card section">
        <h2 style={{ marginTop: 0 }}>{t.funnelTitle}</h2>
        {d.funnel.map((f) => (
          <div key={f.name} className="funnel-row">
            <span>{t.funnel[f.name as keyof typeof t.funnel]}</span>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${(f.users / maxFunnel) * 100}%` }} />
            </div>
            <strong>{f.users}</strong>
          </div>
        ))}
        <p style={{ marginBottom: 0 }}>
          <a className="btn btn-secondary" href={`/api/admin/events?days=${days}`}>
            {t.exportCsv}
          </a>
        </p>
      </section>
    </>
  );
}
