import { ProfileForm } from "@/components/forms/ProfileForm";
import { kk } from "@/i18n/kk";
import { requireUser } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser("/account");
  return (
    <section className="card">
      <h2 style={{ marginTop: 0 }}>{kk.account.profile}</h2>
      <p className="muted">
        {user.email} · {kk.account.since}: {user.createdAt.toLocaleDateString("ru-RU")}
      </p>
      <ProfileForm displayName={user.displayName} grade={user.grade} locale={user.locale} />
    </section>
  );
}
