"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { kk } from "@/i18n/kk";
import { AnswerInput } from "./AnswerInput";
import { ItemBody, type ItemBodyData, type OptionData } from "./ItemBody";

type Response = { choice?: string; choices?: string[]; pairs?: Record<string, string> } | null;

type PublicItem = {
  id: string;
  position: number;
  type: string;
  body: ItemBodyData;
  options: OptionData[];
  maxPoints: number;
};

type AttemptView = {
  attemptId: string;
  version: { id: string; number: number; title: string };
  status: "in_progress" | "submitted";
  score: number | null;
  maxScore: number;
  serverNow: string;
  deadlineAt: string;
  items: PublicItem[];
  answers: { itemId: string; response: Response; flagged: boolean }[];
};

type Pending = { itemId: string; response?: Response; flagged?: boolean };

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function hasAnswer(r: Response | undefined) {
  if (!r) return false;
  if (r.choice) return true;
  if (r.choices && r.choices.length > 0) return true;
  if (r.pairs && Object.values(r.pairs).some(Boolean)) return true;
  return false;
}

/**
 * Timed test runner (FR-05):
 * - timer is based on the server deadline, so a reload does not reset it;
 * - every change is saved immediately; failed saves are retried (NFR-02);
 * - the test is submitted automatically when the time is over.
 */
export function TestRunner({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const [view, setView] = useState<AttemptView | null>(null);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const [finished, setFinished] = useState(false);

  const pending = useRef(new Map<string, Pending>());
  const clockOffset = useRef(0); // serverTime - clientTime
  const finishing = useRef(false);
  const flushing = useRef<Promise<boolean> | null>(null);

  const goToResults = useCallback(() => {
    setFinished(true);
    router.push(`/results/${attemptId}`);
  }, [attemptId, router]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/attempts/${attemptId}`, { cache: "no-store" });
    if (res.status === 401) return router.push(`/login?next=/test/${attemptId}`);
    if (!res.ok) {
      setError(true);
      return;
    }
    const data: AttemptView = await res.json();
    clockOffset.current = new Date(data.serverNow).getTime() - Date.now();
    setView(data);
    setAnswers(Object.fromEntries(data.answers.map((a) => [a.itemId, a.response])));
    setFlags(Object.fromEntries(data.answers.map((a) => [a.itemId, a.flagged])));
    if (data.status === "submitted") goToResults();
  }, [attemptId, router, goToResults]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Sends all unsaved changes one by one. Only one flush runs at a time,
   * so an older answer can never overwrite a newer one on the server.
   * Returns false if something could not be sent.
   */
  const flush = useCallback(async (): Promise<boolean> => {
    while (flushing.current) await flushing.current;
    if (pending.current.size === 0) return true;
    const run = (async () => {
      setSaveState("saving");
      while (pending.current.size > 0) {
        const [itemId, payload] = pending.current.entries().next().value as [string, Pending];
        try {
          const res = await fetch(`/api/attempts/${attemptId}/answers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.status === 409) {
            pending.current.clear(); // time is over or already submitted
            break;
          }
          if (!res.ok) throw new Error(String(res.status));
          // keep the entry if the student changed the answer while it was being sent
          if (pending.current.get(itemId) === payload) pending.current.delete(itemId);
        } catch {
          setSaveState("offline");
          return false;
        }
      }
      setSaveState("saved");
      return true;
    })();
    flushing.current = run;
    try {
      return await run;
    } finally {
      flushing.current = null;
    }
  }, [attemptId]);

  // retry unsaved answers every 3 s and when the connection comes back
  useEffect(() => {
    const retry = () => {
      if (pending.current.size > 0) flush();
    };
    const timer = setInterval(retry, 3000);
    window.addEventListener("online", retry);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", retry);
    };
  }, [flush]);

  function queue(change: Pending) {
    const prev = pending.current.get(change.itemId) ?? { itemId: change.itemId };
    pending.current.set(change.itemId, { ...prev, ...change });
    flush();
  }

  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    await flush();
    const res = await fetch(`/api/attempts/${attemptId}/submit`, { method: "POST" });
    if (!res.ok) {
      finishing.current = false;
      setSaveState("offline");
      return;
    }
    goToResults();
  }, [attemptId, flush, goToResults]);

  // countdown from the server deadline
  useEffect(() => {
    if (!view || view.status === "submitted" || finished) return;
    const tick = () => {
      const now = Date.now() + clockOffset.current;
      const left = Math.max(0, Math.ceil((new Date(view.deadlineAt).getTime() - now) / 1000));
      setRemaining(left);
      if (left === 0) finish();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [view, finished, finish]);

  if (error) return <p>{kk.test.loadError}</p>;
  if (!view || finished) return <p>{kk.test.loading}</p>;

  const item = view.items[current];
  const answeredCount = view.items.filter((i) => hasAnswer(answers[i.id])).length;

  return (
    <div className="runner">
      <section className="card">
        <div className="runner-top">
          <strong>
            {kk.test.item} {item.position} {kk.test.of} {view.items.length} · {item.maxPoints}{" "}
            {kk.test.points}
          </strong>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const next = !flags[item.id];
              setFlags((prev) => ({ ...prev, [item.id]: next }));
              queue({ itemId: item.id, flagged: next });
            }}
          >
            {flags[item.id] ? kk.test.unflag : kk.test.flag}
          </button>
        </div>

        <ItemBody body={item.body} />
        <AnswerInput
          type={item.type}
          body={item.body}
          options={item.options}
          value={answers[item.id] ?? null}
          onChange={(value) => {
            setAnswers((prev) => ({ ...prev, [item.id]: value }));
            queue({ itemId: item.id, response: value });
          }}
        />

        <div className="row">
          <button
            className="btn btn-secondary"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            {kk.test.prev}
          </button>
          <button
            className="btn btn-secondary"
            disabled={current === view.items.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            {kk.test.next}
          </button>
        </div>
      </section>

      <aside className="card">
        <div className="muted">{view.version.title}</div>
        <div className="muted">{kk.test.timeLeft}</div>
        <div className={`timer ${remaining !== null && remaining < 300 ? "low" : ""}`} data-testid="timer">
          {remaining === null ? "--:--" : formatTime(remaining)}
        </div>
        <div className="nav-grid">
          {view.items.map((i, idx) => (
            <button
              key={i.id}
              className={[
                "nav-cell",
                hasAnswer(answers[i.id]) ? "answered" : "",
                idx === current ? "current" : "",
                flags[i.id] ? "flagged" : "",
              ].join(" ")}
              onClick={() => setCurrent(idx)}
            >
              {i.position}
            </button>
          ))}
        </div>
        <p className="muted" style={{ margin: "6px 0" }}>
          {answeredCount} / {view.items.length} {kk.test.answered}
        </p>
        <p className={`save-status ${saveState === "offline" ? "offline" : ""}`}>
          {saveState === "saving" && kk.test.saving}
          {saveState === "saved" && kk.test.saved}
          {saveState === "offline" && kk.test.offline}
        </p>
        <button
          className="btn btn-danger btn-block"
          onClick={() => {
            if (confirm(kk.test.confirmFinish)) finish();
          }}
        >
          {kk.test.finish}
        </button>
      </aside>
    </div>
  );
}
