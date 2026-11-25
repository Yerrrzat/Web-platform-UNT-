"use client";

import { useActionState } from "react";
import { kk } from "@/i18n/kk";
import { updateProfileAction, type FormState } from "@/modules/auth/actions";
import { Field, GradeSelect } from "./Field";

export function ProfileForm({
  displayName,
  grade,
  locale,
}: {
  displayName: string;
  grade: number | null;
  locale: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfileAction, {});
  const t = kk.account;
  return (
    <form action={action} className="form">
      {state.ok && <div className="success">{t.saved}</div>}
      <Field label={kk.auth.name} name="displayName" defaultValue={displayName} error={state.errors?.displayName} />
      <GradeSelect defaultValue={grade ? String(grade) : ""} error={state.errors?.grade} />
      <div className="field">
        <label htmlFor="locale">{t.language}</label>
        <select id="locale" name="locale" defaultValue={locale}>
          <option value="kk">Қазақша</option>
          <option value="ru">Русский</option>
        </select>
      </div>
      <button className="btn" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {t.save}
      </button>
    </form>
  );
}
