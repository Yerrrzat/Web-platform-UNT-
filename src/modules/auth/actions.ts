"use server";

import { redirect } from "next/navigation";
import {
  changePasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  toFieldErrors,
  type FieldErrors,
} from "./validation";
import { AuthError, authenticate, changePassword, registerUser, updateProfile } from "./service";
import { requireUser, setSessionCookie } from "./session";

/** Form actions for login, registration and account settings. */

export type FormState = { errors?: FieldErrors; ok?: boolean; values?: Record<string, string> };

/** Only local paths are allowed after login (no open redirects). */
function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export async function registerAction(_prev: FormState, form: FormData): Promise<FormState> {
  const values = {
    displayName: String(form.get("displayName") ?? ""),
    email: String(form.get("email") ?? ""),
    grade: String(form.get("grade") ?? ""),
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: form.get("password"),
    consent: form.get("consent") === "on",
  });
  if (!parsed.success) return { errors: toFieldErrors(parsed.error), values };
  try {
    const user = await registerUser(parsed.data);
    await setSessionCookie(user);
  } catch (e) {
    if (e instanceof AuthError) return { errors: { email: e.message }, values };
    throw e;
  }
  redirect(safeNext(form.get("next")));
}

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const values = { email: String(form.get("email") ?? "") };
  const parsed = loginSchema.safeParse({ email: values.email, password: form.get("password") });
  if (!parsed.success) return { errors: toFieldErrors(parsed.error), values };
  try {
    const user = await authenticate(parsed.data.email, parsed.data.password);
    await setSessionCookie(user);
  } catch (e) {
    if (e instanceof AuthError) return { errors: { form: e.message }, values };
    throw e;
  }
  redirect(safeNext(form.get("next")));
}

export async function updateProfileAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/account");
  const parsed = profileSchema.safeParse({
    displayName: form.get("displayName"),
    grade: form.get("grade"),
    locale: form.get("locale"),
  });
  if (!parsed.success) return { errors: toFieldErrors(parsed.error) };
  await updateProfile(user.id, parsed.data);
  return { ok: true };
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser("/account/security");
  const parsed = changePasswordSchema.safeParse({
    current: form.get("current"),
    next: form.get("next"),
    repeat: form.get("repeat"),
  });
  if (!parsed.success) return { errors: toFieldErrors(parsed.error) };
  try {
    await changePassword(user.id, parsed.data.current, parsed.data.next);
  } catch (e) {
    if (e instanceof AuthError) return { errors: { current: e.message } };
    throw e;
  }
  return { ok: true };
}
