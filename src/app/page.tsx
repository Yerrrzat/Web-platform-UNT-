import Link from "next/link";
import { StartTestButton } from "@/components/StartTestButton";
import { kk } from "@/i18n/kk";
import { getCurrentUser } from "@/modules/auth/session";
import { hasActiveSubscription } from "@/modules/billing/service";
import { listPublishedVersions } from "@/modules/catalogue/catalogue";

export const dynamic = "force-dynamic";

const t = kk.catalogue;

export default async function CataloguePage() {
  const user = await getCurrentUser();
  const subscribed = user ? await hasActiveSubscription(user.id) : false;
  const versions = await listPublishedVersions(subscribed);

  return (
    <>
      <h1>{t.title}</h1>
      <p className="muted">{t.subtitle}</p>
      {versions.length === 0 && <p>{t.empty}</p>}
      <div className="grid">
        {versions.map((v) => (
          <div key={v.id} className="card" data-testid={`version-${v.number}`}>
            <span className={`badge ${v.access === "premium" ? "badge-amber" : ""}`}>
              {v.access === "free" ? t.free : t.premium}
            </span>
            <h2 style={{ margin: "10px 0 6px" }}>{v.title}</h2>
            <p className="muted" style={{ margin: "0 0 14px" }}>
              {v.itemCount} {t.items} · {v.timeLimitMin} {t.minutes} · {t.maxScore}: {v.maxScore}
            </p>
            {!user ? (
              <Link className="btn" href="/login?next=/">
                {t.start}
              </Link>
            ) : v.locked ? (
              <Link className="btn btn-amber" href="/account/subscription?from=paywall">
                🔒 {t.unlock}
              </Link>
            ) : (
              <StartTestButton versionId={v.id} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
