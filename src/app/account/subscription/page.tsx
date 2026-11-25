import { kk } from "@/i18n/kk";
import { requireUser } from "@/modules/auth/session";
import { isSubscriptionActive, PLANS, type PlanId } from "@/modules/billing/access";
import { cancelAction, checkoutAction } from "@/modules/billing/actions";
import { getSubscription, listPayments } from "@/modules/billing/service";
import { trackEvent } from "@/modules/events/track";

export const dynamic = "force-dynamic";

const t = kk.account;

function kzt(n: number) {
  return `${n.toLocaleString("ru-RU")} ₸`;
}

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const user = await requireUser("/account/subscription");
  const { from } = await searchParams;
  if (from === "paywall") await trackEvent("paywall_view", user.id);

  const [sub, payments] = await Promise.all([getSubscription(user.id), listPayments(user.id)]);
  const active = isSubscriptionActive(sub, new Date());

  return (
    <>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{t.subscription}</h2>
        {from === "paywall" && <div className="notice">{t.paywallNote}</div>}
        {active && sub ? (
          <div className="success" data-testid="sub-status">
            {sub.status === "cancelled" ? t.subCancelled : t.subActive}: {PLANS[sub.plan as PlanId].titleKk} ·{" "}
            {sub.paidUntil.toLocaleDateString("ru-RU")} {t.paidUntil}
          </div>
        ) : (
          <p className="muted" data-testid="sub-status">{t.subNone}</p>
        )}
        {active && sub?.status === "active" && (
          <form action={cancelAction}>
            <button className="btn btn-secondary">{t.cancel}</button>
          </form>
        )}
      </section>

      <section className="section">
        <h2>{t.plans}</h2>
        <div className="grid">
          {(Object.keys(PLANS) as PlanId[]).map((id) => (
            <form key={id} action={checkoutAction} className={`card price-card ${id === "until_unt" ? "featured" : ""}`}>
              <strong>{PLANS[id].titleKk}</strong>
              <div className="price">{kzt(PLANS[id].priceKzt)}</div>
              <p className="muted">{PLANS[id].noteKk}</p>
              <input type="hidden" name="plan" value={id} />
              <button className="btn">{t.payTest}</button>
            </form>
          ))}
        </div>
        <p className="muted small">{t.testModeNote}</p>
      </section>

      <section className="section card">
        <h2 style={{ marginTop: 0 }}>{t.payments}</h2>
        {payments.length === 0 ? (
          <p className="muted">{t.noPayments}</p>
        ) : (
          <table className="list">
            <thead>
              <tr>
                <th>{t.date}</th>
                <th>{t.plan}</th>
                <th>{t.amount}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.createdAt.toLocaleDateString("ru-RU")}</td>
                  <td>{PLANS[p.subscription.plan as PlanId].titleKk}</td>
                  <td>{kzt(p.amountKzt)}</td>
                  <td>{p.status === "succeeded" ? "✓" : p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
