"use client";

import { kk } from "@/i18n/kk";
import type { ItemBodyData, OptionData } from "./ItemBody";

type Response = { choice?: string; choices?: string[]; pairs?: Record<string, string> } | null;

type Props = {
  type: string;
  body: ItemBodyData;
  options: OptionData[];
  value: Response;
  disabled?: boolean;
  onChange: (value: Response) => void;
};

/** Answer controls for the four UNT item types. */
export function AnswerInput({ type, body, options, value, disabled, onChange }: Props) {
  if (type === "single" || type === "context") {
    return (
      <div className="options" role="radiogroup">
        <p className="muted" style={{ margin: 0 }}>{kk.test.chooseOne}</p>
        {options.map((o) => {
          const selected = value?.choice === o.id;
          return (
            <label key={o.id} className={`option ${selected ? "selected" : ""}`}>
              <input
                type="radio"
                checked={selected}
                disabled={disabled}
                onChange={() => onChange({ choice: o.id })}
              />
              <strong>{o.id})</strong> {o.text}
            </label>
          );
        })}
      </div>
    );
  }

  if (type === "multiple") {
    const chosen = new Set(value?.choices ?? []);
    return (
      <div className="options">
        <p className="muted" style={{ margin: 0 }}>{kk.test.chooseMany}</p>
        {options.map((o) => {
          const selected = chosen.has(o.id);
          return (
            <label key={o.id} className={`option ${selected ? "selected" : ""}`}>
              <input
                type="checkbox"
                checked={selected}
                disabled={disabled}
                onChange={() => {
                  const next = new Set(chosen);
                  if (selected) next.delete(o.id);
                  else next.add(o.id);
                  onChange({ choices: [...next].sort() });
                }}
              />
              <strong>{o.id})</strong> {o.text}
            </label>
          );
        })}
      </div>
    );
  }

  // matching
  const pairs = value?.pairs ?? {};
  return (
    <div>
      <p className="muted">{kk.test.matchHint}</p>
      {(body.left ?? []).map((l) => (
        <div key={l.id} className="match-row">
          <span style={{ minWidth: 160 }}>
            <strong>{l.id}.</strong> {l.text}
          </span>
          <select
            value={pairs[l.id] ?? ""}
            disabled={disabled}
            onChange={(e) => onChange({ pairs: { ...pairs, [l.id]: e.target.value } })}
          >
            <option value="">{kk.test.choose}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id}) {o.text}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
