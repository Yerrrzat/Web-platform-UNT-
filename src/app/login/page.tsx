import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { kk } from "@/i18n/kk";
import { getCurrentUser } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  return (
    <div className="card form-card">
      <h1 style={{ marginTop: 0 }}>{kk.auth.loginTitle}</h1>
      <LoginForm next={next} />
    </div>
  );
}
