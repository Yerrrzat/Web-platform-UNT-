import { kk } from "@/i18n/kk";
import type { TopicScore } from "@/modules/results/results";

/** Percentage per topic; the weakest topic is highlighted (FR-09). */
export function TopicBreakdown({ topics }: { topics: TopicScore[] }) {
  return (
    <ul className="topic-list">
      {topics.map((t) => (
        <li
          key={t.code}
          className={`topic-row ${t.weakest ? "weakest" : ""}`}
          data-testid={t.weakest ? "weakest-topic" : undefined}
        >
          <div className="topic-head">
            <span>
              {t.name}
              {t.weakest && <span className="badge badge-bad">{kk.results.weakest}</span>}
            </span>
            <strong>
              {t.percent}% <span className="muted">({t.earned}/{t.max})</span>
            </strong>
          </div>
          <div className="bar" aria-hidden>
            <div className="bar-fill" style={{ width: `${t.percent}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
