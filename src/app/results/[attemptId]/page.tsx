import Link from "next/link";
import { ItemBody, type ItemBodyData } from "@/components/ItemBody";
import { TopicBreakdown } from "@/components/TopicBreakdown";
import { kk } from "@/i18n/kk";
import { requireUser } from "@/modules/auth/session";
import { getAttemptResult } from "@/modules/results/queries";

export const dynamic = "force-dynamic";

const t = kk.results;

export default async function ResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const user = await requireUser(`/results/${attemptId}`);
  const result = await getAttemptResult(attemptId, user.id);

  if (!result) return <p>{t.notFound}</p>;
  if (result.status === "in_progress") {
    return (
      <div className="card">
        <p>{t.notFinished}</p>
        <Link className="btn" href={`/test/${attemptId}`}>
          {t.continueTest}
        </Link>
      </div>
    );
  }

  const weakest = result.topics.find((x) => x.weakest);

  return (
    <>
      <h1>
        {t.title}: {result.versionTitle}
      </h1>

      <div className="card summary">
        <div>
          <div className="muted">{t.score}</div>
          <div className="big-score" data-testid="result-score">
            {result.score} / {result.max}
          </div>
        </div>
        <div>
          <div className="muted">{t.percent}</div>
          <div className="big-score">{result.percent}%</div>
        </div>
        {weakest && (
          <div>
            <div className="muted">{t.weakest}</div>
            <strong>{weakest.name}</strong>
            <div className="muted small">{t.weakestHint}</div>
          </div>
        )}
      </div>

      <section className="section card">
        <h2 style={{ marginTop: 0 }}>{t.topicsTitle}</h2>
        <TopicBreakdown topics={result.topics} />
      </section>

      <section className="section">
        <h2>{t.itemsTitle}</h2>
        {result.items.map((item) => (
          <article key={item.itemId} className={`card result-item ${item.status}`}>
            <div className="runner-top">
              <strong>
                {t.item} {item.position} · {item.points}/{item.maxPoints} {t.points}
              </strong>
              <span className={`status ${item.status}`}>{t.status[item.status]}</span>
            </div>
            <ItemBody body={item.body as ItemBodyData} />
            <div className="answer-grid">
              <span className="muted">{t.yourAnswer}</span>
              <span>{item.yourAnswer}</span>
              <span className="muted">{t.correctAnswer}</span>
              <strong>{item.correctAnswer}</strong>
              <span className="muted">{t.explanation}</span>
              <span>{item.explanation}</span>
            </div>
          </article>
        ))}
      </section>

      <div className="row">
        <Link className="btn btn-secondary" href="/history">
          {t.toHistory}
        </Link>
        <Link className="btn" href="/">
          {t.toCatalogue}
        </Link>
      </div>
    </>
  );
}
