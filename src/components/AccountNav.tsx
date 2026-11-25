"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { kk } from "@/i18n/kk";

const LINKS = [
  { href: "/account", label: kk.account.profile },
  { href: "/account/subscription", label: kk.account.subscription },
  { href: "/account/security", label: kk.account.security },
  { href: "/history", label: kk.nav.history },
];

export function AccountNav() {
  const path = usePathname();
  return (
    <nav className="card side-nav">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
