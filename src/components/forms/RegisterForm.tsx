"use client";

import Link from "next/link";
import { useActionState } from "react";
import { kk } from "@/i18n/kk";
import { registerAction, type FormState } from "@/modules/auth/actions";
import { Field, GradeSelect } from "./Field";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(registerAction, {});
  const t = kk.auth;
  return (
    <form action={action} className="form">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label={t.name} name="displayName" autoComplete="name" error={state.errors?.displayName} defaultValue={state.values?.displayName} />
      <Field label={t.email} name="email" type="email" autoComplete="email" error={state.errors?.email} defaultValue={state.values?.email} />
      <Field
        label={t.password}
        name="password"
        type="password"
        autoComplete="new-password"
        hint={t.passwordHint}
        error={state.errors?.password}
      />
      <GradeSelect error={state.errors?.grade} defaultValue={state.values?.grade} />
      <label className="checkbox">
        <input type="checkbox" name="consent" />
        <span>{t.consent}</span>
      </label>
      {state.errors?.consent && <span className="field-error">{state.errors.consent}</span>}
      <button className="btn btn-block" disabled={pending}>
        {t.submitRegister}
      </button>
      <p className="muted small">
        {t.haveAccount} <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>{kk.nav.login}</Link>
      </p>
    </form>
  );
}
