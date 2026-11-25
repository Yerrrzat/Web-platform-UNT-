"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { kk } from "@/i18n/kk";

/** Starts (or resumes) an attempt. Guests go to login, locked versions to the subscription page. */
export function StartTestButton({ versionId }: { versionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    const res = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ versionId }),
    });
    if (res.status === 401) return router.push("/login?next=/");
    if (res.status === 402) return router.push("/account/subscription?from=paywall");
    if (!res.ok) {
      setBusy(false);
      alert(kk.test.loadError);
      return;
    }
    const { attemptId } = await res.json();
    router.push(`/test/${attemptId}`);
  }

  return (
    <button className="btn" onClick={start} disabled={busy}>
      {kk.catalogue.start}
    </button>
  );
}
