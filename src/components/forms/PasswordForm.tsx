"use client";

import { useActionState } from "react";
import { kk } from "@/i18n/kk";
import { changePasswordAction, type FormState } from "@/modules/auth/actions";
import { Field } from "./Field";

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, {});
  const t = kk.account;
  return (
    <form action={action} className="form">
      {state.ok && <div className="success">{t.passwordChanged}</div>}
      <Field label={t.currentPassword} name="current" type="password" autoComplete="current-password" error={state.errors?.current} />
      <Field label={t.newPassword} name="next" type="password" autoComplete="new-password" hint={kk.auth.passwordHint} error={state.errors?.next} />
      <Field label={t.repeatPassword} name="repeat" type="password" autoComplete="new-password" error={state.errors?.repeat} />
      <button className="btn" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {t.changePassword}
      </button>
    </form>
  );
}
