import type { Metadata } from "next";
import Link from "next/link";
import { kk } from "@/i18n/kk";
import { getCurrentUser } from "@/modules/auth/session";
import "./globals.css";

export const metadata: Metadata = {
  title: kk.appName,
  description: kk.catalogue.subtitle,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang={user?.locale ?? "kk"}>
      <body>
        <header className="site-header">
          <Link href="/" className="logo">
            ҰБТ <span>Информатика</span>
          </Link>
          <nav className="site-nav">
            <Link href="/">{kk.nav.catalogue}</Link>
            {user ? (
              <>
                <Link href="/history">{kk.nav.history}</Link>
                <Link href="/account/subscription">{kk.nav.subscription}</Link>
                {user.role === "admin" && <Link href="/admin/analytics">{kk.nav.analytics}</Link>}
                <Link href="/account" className="nav-cta">
                  {user.displayName}
                </Link>
                <form action="/logout" method="post">
                  <button className="link-button" type="submit">
                    {kk.nav.logout}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">{kk.nav.login}</Link>
                <Link href="/register" className="nav-cta">
                  {kk.nav.register}
                </Link>
              </>
            )}
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
