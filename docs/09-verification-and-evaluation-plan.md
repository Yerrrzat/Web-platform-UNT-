# 9. Verification and Evaluation Plan

The plan answers two questions:

- **Verification:** does the MVP meet its requirements?
- **Evaluation:** does it achieve the project aim, meaning it helps students practise effectively and shows commercial potential?

## 9.1 Verification (testing plan)

| Level | Tool | What is tested | Requirements | When |
|---|---|---|---|---|
| Unit | Vitest | Scoring engine (every item type, partial credit, empty answers), entitlement rules, import schema validation, subscription expiry | FR-06, FR-11, FR-13, FR-14 | Every PR (CI) |
| Integration | Vitest + test PostgreSQL (Docker) | Attempt lifecycle (start, save, resume, submit), payment webhook with valid/invalid signature, event recording | FR-05, FR-12, FR-16 | Every PR (CI) |
| End-to-end | Playwright (Chromium, WebKit, 375 px mobile) | Scenarios S1–S6 from Section 8; network drop during a test; no answer keys in network responses | FR-01…FR-15, NFR-02, NFR-04, NFR-08 | Every PR to `main` |
| Performance | k6 | 100 concurrent sessions saving answers; p95 ≤ 300 ms | NFR-01 | Before pilot |
| Front-end quality | Lighthouse CI, axe-core | Performance ≥ 80 (mobile), no critical accessibility issues | NFR-01, NFR-09 | Weekly / before release |
| Security | gitleaks, npm audit, manual OWASP checklist | No secrets, no known critical vulnerabilities, authorization on every premium route | NFR-03 | Every PR + before pilot |
| Content QA | Import validator + peer review of 1 version by an informatics teacher | No empty explanations, correct keys, topic tags | FR-08, FR-14 | Each new version |

**Acceptance rule:** a *Must* requirement is accepted only when its acceptance criterion (Section 6) is covered by a passing automated test or by a recorded manual check in the test log (`tests/README.md`).

## 9.2 Evaluation: outcome metrics

| Metric | Definition | Target | Data source |
|---|---|---|---|
| M1 Activation | % of registered users who finish ≥ 1 full test | ≥ 50% | Events `registered`, `test_finished` |
| M2 Test completion rate | Finished / started attempts | ≥ 70% | Attempts table |
| M3 Learning progress | Mean change in score (%) between a student's 1st and 3rd attempt on *different* versions of similar difficulty | ≥ +10 percentage points | Attempts, Answers |
| M4 Weak-topic improvement | Change in % correct in the student's weakest topic after ≥ 2 more attempts | Positive, significant (paired t-test / Wilcoxon, α = 0.05) | Answers + ItemTopic |
| M5 Usability | System Usability Scale | ≥ 70 | Survey (n ≥ 10) |
| M6 Perceived value of explanations | Share of students rating explanations as "useful" or "very useful" | ≥ 70% | Survey |
| M7 Paywall conversion | Paid users / users who saw the paywall | ≥ 3% (benchmark range for freemium is low single digits) | Events |
| M8 Willingness to pay | Share choosing a paid plan, or saying they would pay at the tested price | ≥ 20% of surveyed users | Survey + checkout starts |
| M9 Reliability | Uptime during the pilot | ≥ 99% | External monitor |

## 9.3 Measurement conditions

- **Pilot:** 4 weeks between February and March 2027 with **≥ 30 students** on the Mathematics–Informatics profile. Recruited through informatics teachers and the author's student groups, with consent (parental consent for under-18s). Only pseudonymous IDs are used in the analysis.
- **Devices:** students' own phones and computers. The device type is logged to compare mobile and desktop use.
- **Content:** ≥ 10 versions of comparable difficulty (the blueprint is checked against the specification), so that score changes reflect learning rather than easier versions.
- **Payments:** test mode, or real payments if the business is registered by then. Without real payments, M7 is measured as "checkout started" and reported as *intent*, not revenue.

## 9.4 Baseline for comparison

| Baseline | How it is used |
|---|---|
| **B1: NTC free trial test** (official format, score + thematic analysis) | In the survey, students who used both rate usefulness of feedback (M6) for each. The project claims an advantage only for item-level explanations. |
| **B2: Practice without explanations (internal A/B)** | During the pilot, half of the users (random assignment) see only correct answers for their first 2 attempts, and the other half see full explanations. M3 and M4 are compared between groups. This isolates the effect of the key feature. |
| **B3: Market price baseline** | iTest (≈ 1,500 KZT per month equivalent) vs. course platforms (tens of thousands of KZT). Used to interpret M7 and M8. |

## 9.5 Commercialization assessment

The pilot data feed the commercialization assessment in the final report:

1. Market size: the number of UNT participants choosing the Mathematics–Informatics pair (NTC statistics) → TAM/SAM/SOM.
2. Unit economics: price, M7 conversion, hosting and payment fees, customer acquisition cost from pilot channels → break-even number of subscribers.
3. A go/no-go recommendation with the conditions for continuing.

## 9.6 Threats to validity

- *Selection bias:* pilot volunteers are motivated students. This is reported, and results are not generalised to all candidates.
- *Small sample:* effect sizes and confidence intervals are reported, not only p-values.
- *Author as content writer:* item quality is checked by an external teacher (Content QA).
