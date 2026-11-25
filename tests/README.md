# Tests
Test strategy: see [docs/09](../docs/09-verification-and-evaluation-plan.md).

Run: `npm test` · coverage: `npm run test:coverage` · CI runs both on every pull request.

| File | Level | What it checks | Requirement |
|---|---|---|---|
| `unit/scoring.test.ts` | Unit | Single/context 1–0, multiple and matching 2–1–0, empty answer, all options selected, total = sum | FR-06 |
| `unit/session-rules.test.ts` | Unit | Deadline and remaining time, grace period, no saving after deadline/submit, answer keys removed | FR-05, NFR-04 |
| `unit/auth.test.ts` | Unit | bcrypt hashing, signed session token (forged, edited, expired), registration and password rules | FR-01, FR-02, NFR-05 |
| `unit/billing.test.ts` | Unit | Free vs premium access, active/cancelled/expired subscription, paid period, renewal | FR-11, FR-12 |
| `unit/results.test.ts` | Unit | Item status, % per topic, one weakest topic, answer formatting | FR-08, FR-09 |
| `unit/analytics.test.ts` | Unit | Activation, completion, average score, growth 1st → 3rd attempt, conversion, funnel, daily series, CSV | FR-16, FR-17 |
| `unit/topic-breakdown.test.tsx` | Component (jsdom) | Topics and percentages rendered, weakest topic highlighted | FR-09 |
| `integration/attempt-lifecycle.test.ts` | Integration (PostgreSQL) | Start → resume → autosave → reload → submit; 409 after deadline; auto-submit; 403 for another student; 402 for premium without subscription | FR-05, FR-06, FR-11 |
| `integration/auth-billing.test.ts` | Integration (PostgreSQL) | Register, duplicate email, login, profile, password change; test checkout, renewal, cancel | FR-01, FR-02, FR-12 |

## Manual test log
| Date | Requirement | Check | Result | By |
|---|---|---|---|---|
| | | | | |
