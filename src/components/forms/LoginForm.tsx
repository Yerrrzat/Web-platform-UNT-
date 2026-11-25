"use client";

import Link from "next/link";
import { useActionState } from "react";
import { kk } from "@/i18n/kk";
import { loginAction, type FormState } from "@/modules/auth/actions";
import { Field } from "./Field";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  const t = kk.auth;
  return (
    <form action={action} className="form">
      {state.errors?.form && <div className="notice">{state.errors.form}</div>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label={t.email} name="email" type="email" autoComplete="email" error={state.errors?.email} defaultValue={state.values?.email} />
      <Field label={t.password} name="password" type="password" autoComplete="current-password" error={state.errors?.password} />
      <button className="btn btn-block" disabled={pending}>
        {t.submitLogin}
      </button>
      <p className="muted small">
        {t.noAccount} <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}>{kk.nav.register}</Link>
      </p>
    </form>
  );
}
