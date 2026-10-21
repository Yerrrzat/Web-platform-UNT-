# 6. Requirements Specification (initial)

Priorities follow **MoSCoW**: **M** = Must (MVP is not accepted without it), **S** = Should, **C** = Could, **W** = Won't (this release). Every *Must* requirement has an acceptance criterion that can be checked by a test (Section 9). "Source" links each requirement to evidence (Section 2) or literature (Section 3).

## 6.1 Actors

- **Guest:** an unregistered visitor.
- **Student:** a registered user on the free or premium plan.
- **Administrator:** the content owner and operator.
- **Payment provider:** an external system.

## 6.2 Functional requirements

| ID | Requirement | Priority | Source | Acceptance criteria |
|---|---|---|---|---|
| FR-01 | A guest can register with email and password and verify the email | M | — | Given a valid email and password (≥ 8 characters), an account is created and a verification link is sent. An unverified user cannot start a test. A duplicate email is rejected with a message. |
| FR-02 | A student can log in, log out and reset a forgotten password | M | — | A valid login creates a session. An invalid login shows an error after ≤ 1 s. A reset link expires after 60 minutes. |
| FR-03 | A guest/student can browse the catalogue of Informatics test versions with a free/premium label | M | E2 | The catalogue lists all *published* versions with number, difficulty and lock icon. Unpublished versions are never shown. |
| FR-04 | A guest can try one demo version without registering | S | [14] | The demo opens without login. The results page asks the guest to register to save them. |
| FR-05 | A student can take a timed test that copies the UNT Informatics block (40 items, single choice, multiple choice, matching and context-block items) | M | E1, [3] | The timer counts down from the configured limit. The student can move between items and flag them. Answers are saved within 2 s of selection. A reload or reconnect restores the session with the remaining time. The test auto-submits at 00:00. |
| FR-06 | The system scores a submitted attempt according to UNT rules | M | E1, [15] | Single-choice items: 1/0. Multiple-choice and matching items: partial credit per the specification table. The total equals the sum of item scores. Scoring unit tests cover every item type and edge case (no answer, all options selected). |
| FR-07 | Items can contain formatted Python code, SQL tables, images and spreadsheet fragments | M | Finding 4 | Code renders with syntax highlighting and preserved indentation. Tables render with headers. Images have alt text. The rendering is identical in the admin preview and the test runner. |
| FR-08 | After submission, the student sees the correct answer and an explanation for every item | M | [6], [7] | Each item on the results page shows the student's answer, the correct answer and a non-empty explanation. Publishing a version with an empty explanation is blocked. |
| FR-09 | The results page shows a breakdown by specification topic | M | [7] | Every item has ≥ 1 topic tag. The results page shows the percentage correct per topic, and the topic with the lowest score is highlighted. |
| FR-10 | A student can view their attempt history and progress chart | S | [2], [5] | The history lists all attempts with date, version and score. The chart shows the score over time when there are ≥ 2 attempts. |
| FR-11 | The free plan gives access to a limited set of versions | M | [14] | Free users can open exactly N versions (configurable, default 3). Opening a premium version shows the paywall. Access is checked on the server, so direct URL access is denied with 403. |
| FR-12 | A student can buy a subscription (monthly or "until UNT") | M | [13] | Checkout redirects to the provider (test mode). After a successful webhook, the plan becomes premium within 1 minute. A failed or cancelled payment leaves the plan unchanged. A webhook signature is verified, and an invalid signature is rejected. |
| FR-13 | Subscription expiry is handled automatically | M | — | When `paid_until` < now, premium versions become locked again. The student sees the expiry date in the profile. |
| FR-14 | The administrator can import a test version from a JSON file (with images) and preview it | M | O5 | Import validates the schema (40 items, item types, answer keys, topics, explanations) and lists errors by item number. A valid file creates a *draft* version. The preview shows the version as the student would see it. |
| FR-15 | The administrator can publish/unpublish versions and mark them free/premium | M | — | A status change is visible in the catalogue immediately. All status changes are logged with time and admin. |
| FR-16 | The system records product analytics events (registration, test start/finish, paywall view, checkout start, payment) | M | O6, O7 | Each listed event is stored with user ID (pseudonymous), timestamp and context. The admin can export events as CSV for the conversion funnel. |
| FR-17 | The administrator sees a basic dashboard (users, attempts, conversion) | S | O7 | The dashboard shows counts for the last 7/30 days, matching SQL checks on the events table. |
| FR-18 | A student can report an error in an item | S | Quality | A "report" button saves the item ID and comment. The admin sees the list of open reports. |
| FR-19 | Russian-language interface and content | C | [10] | All UI strings are available in RU. Content is shown in RU when a translation exists. |
| FR-20 | Teacher accounts that assign tests to a class | C | [12] | Future release. |
| FR-21 | Adaptive test generation / AI explanations | W | — | Out of scope (future work). |

## 6.3 Non-functional requirements

| ID | Category | Requirement | Priority | Acceptance criteria / measurement |
|---|---|---|---|---|
| NFR-01 | Performance | Fast page loads on mobile networks | M | Lighthouse Performance ≥ 80 on mobile for the catalogue and runner pages. p95 server response for saving an answer ≤ 300 ms at 100 concurrent sessions (k6 load test). |
| NFR-02 | Reliability | No loss of answers during a test | M | In an E2E test, killing the network for 30 s and then restoring it keeps all answers, and the attempt can still be submitted. |
| NFR-03 | Security | Protection against the OWASP Top 10 basics | M | Passwords hashed with bcrypt/argon2. All forms CSRF-protected. Authorization checked server-side for every premium resource (automated test). No secrets in the repository (gitleaks in CI passes). |
| NFR-04 | Security | Answer keys are never sent to the client before submission | M | Inspecting network responses during a test shows no `correct` fields (automated E2E check). |
| NFR-05 | Privacy | Minimal personal data; compliance with the Law of RK "On Personal Data and Their Protection" | M | Only email, display name and grade are collected. A privacy policy page exists. A user can delete their account, and the data is removed within 30 days. |
| NFR-06 | Usability | The platform is easy to use for school students | M | SUS score ≥ 70 in the pilot (n ≥ 10). A new user completes registration and starts a test in ≤ 3 minutes without help. |
| NFR-07 | Localization | Kazakh interface and content first | M | 100% of UI strings in Kazakh. Language is switched through i18n files, with no hard-coded strings (lint rule). |
| NFR-08 | Compatibility | Works on current mobile and desktop browsers | M | E2E tests pass on Chromium, WebKit and a mobile viewport of 375 px. |
| NFR-09 | Accessibility | Basic WCAG 2.1 AA | S | axe-core shows no critical violations on the main pages. |
| NFR-10 | Maintainability | Automated tests and CI | M | CI runs lint, unit and E2E tests on every pull request. Scoring and billing modules have ≥ 80% line coverage. |
| NFR-11 | Availability | Uptime during the pilot | S | ≥ 99% uptime measured by an external monitor over the pilot period. |
| NFR-12 | Cost | Low operating cost | S | Hosting cost during the pilot ≤ 10,000 KZT per month. |

## 6.4 Constraints

- Item content must be original. It is written to the public NTC specification, and NTC items are not copied.
- Payments run in test mode until the business is registered.
- Pilot participants under 18 take part only with consent, and no unnecessary personal data is collected.

## 6.5 Traceability summary

| Objective | Requirements |
|---|---|
| O4 Build MVP | FR-01…FR-15, NFR-01…NFR-10 |
| O5 Content | FR-07, FR-14, FR-18 |
| O6 Pilot evaluation | FR-09, FR-10, FR-16, NFR-06 |
| O7 Commercialization | FR-11…FR-13, FR-16, FR-17 |
