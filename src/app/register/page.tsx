import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { kk } from "@/i18n/kk";
import { getCurrentUser } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
  return (
    <div className="card form-card">
      <h1 style={{ marginTop: 0 }}>{kk.auth.registerTitle}</h1>
      <RegisterForm next={next} />
    </div>
  );
}
