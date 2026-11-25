import { PasswordForm } from "@/components/forms/PasswordForm";
import { kk } from "@/i18n/kk";

export default function SecurityPage() {
  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{kk.account.security}</h2>
      <PasswordForm />
    </section>
  );
}
