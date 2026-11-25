import Link from "next/link";
import { LineChart } from "@/components/LineChart";
import { kk } from "@/i18n/kk";
import { requireUser } from "@/modules/auth/session";
import { getAttemptHistory } from "@/modules/results/queries";

export const dynamic = "force-dynamic";

const t = kk.history;

export default async function HistoryPage() {
  const user = await requireUser("/history");
  const history = await getAttemptHistory(user.id);

  return (
    <>
      <h1>{t.title}</h1>
      {history.length === 0 && (
        <p>
          {t.empty} <Link href="/">{kk.results.toCatalogue}</Link>
        </p>
      )}

      {history.length > 0 && (
        <section className="card">
          <h2 style={{ marginTop: 0 }}>{t.chartTitle}</h2>
          {history.length >= 2 ? (
            <LineChart points={history.map((h, i) => ({ label: `#${i + 1}`, value: h.percent }))} />
          ) : (
            <p className="muted">{t.chartHint}</p>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="card section">
          <table className="list">
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.version}</th>
                <th>{t.score}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((h) => (
                <tr key={h.attemptId}>
                  <td>{h.submittedAt.toLocaleDateString("ru-RU")}</td>
                  <td>{h.versionTitle}</td>
                  <td>
                    {h.score} / {h.max} ({h.percent}%)
                  </td>
                  <td>
                    <Link href={`/results/${h.attemptId}`}>{t.open}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}
