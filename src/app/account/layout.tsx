import { AccountNav } from "@/components/AccountNav";
import { kk } from "@/i18n/kk";
import { requireUser } from "@/modules/auth/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/account");
  return (
    <>
      <h1>{kk.account.title}</h1>
      <div className="account">
        <AccountNav />
        <div>{children}</div>
      </div>
    </>
  );
}
