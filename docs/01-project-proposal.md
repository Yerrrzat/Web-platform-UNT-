# 1. Project Proposal

| Item | Details |
|---|---|
| **Project title** | Managing the development of an MVP web platform for Unified National Testing (UNT) preparation in Computer Science and assessing its commercialization potential |
| **Working product name** | UNT Informatics Prep (repository: `Web-platform-UNT-`) |
| **Type** | Individual diploma project (startup track) |
| **Student** | Yerzat Qaldyqan, group SE-2408, Astana IT University |
| **Supervisor** | Zarina Almabekkyzy |
| **Stage** | Probationary period 1 (prob-period-1), October 2026 |

## 1.1 Problem statement

Every year, school leavers in Kazakhstan sit the Unified National Testing (UNT, ҰБТ / ЕНТ). It is a computer-based exam of 120 items over five subjects, lasts four hours and is scored out of 140 points. Students on the *Mathematics – Informatics* profile answer 40 Informatics items, so this subject alone carries a large share of the score that decides state grants for IT programmes.

Several commercial preparation services exist (iTest, Joo.kz, Daryn.online and others; see Section 4), and the National Testing Center (NTC) runs a free trial test. However, the following problems remain for Informatics specifically:

1. **Informatics is a minor subject on general platforms.** Large services focus on the compulsory subjects and on mathematics. Informatics content is thin, rarely updated to the current specification, and often lacks Python code and SQL table tasks, which are now standard UNT item types.
2. **Weak feedback after a mock test.** Many services show only a score or the correct letter. Students cannot see *why* an answer is wrong or which specification topic it belongs to, so they do not know what to revise.
3. **Kazakh-language content gap.** Good Informatics material in Kazakh is scarcer than in Russian.
4. **Price and format mismatch.** Full courses cost tens of thousands of tenge and bundle live lessons that many students do not need. Students who only want realistic Informatics practice tests with explanations have no cheap, focused option.

## 1.2 Target users

| User group | Description | Main need |
|---|---|---|
| **Primary: UNT candidates (grades 10–11)** on the Mathematics–Informatics profile | Kazakh- and Russian-medium school students preparing for the UNT | Realistic timed Informatics mock tests, explanations, topic-level weaknesses |
| **Secondary: informatics teachers and tutors** | School teachers and private tutors | A ready bank of specification-aligned tests to recommend to students |
| **Business stakeholder: platform owner/administrator** | The author as content owner and operator | Managing the test bank, subscriptions and usage analytics |

## 1.3 Aim

To plan, manage and deliver a working MVP of a web platform where students take UNT-format Informatics mock tests with detailed explanations under a freemium subscription model, and to assess the platform's commercialization potential using MVP usage and payment-intent data.

## 1.4 Objectives

| # | Objective | Measurable result |
|---|---|---|
| O1 | Confirm the problem with target users | 3–5 structured interviews with students/teachers; a summary of verified findings vs. assumptions (Section 2) |
| O2 | Analyse existing solutions and literature | ≥ 12 sources (≥ 8 scientific); comparison of 5 systems against 8 criteria (Sections 3–4) |
| O3 | Specify and design the MVP | Prioritised requirements with acceptance criteria; context, use case and component diagrams (Sections 6–7) |
| O4 | Build the MVP | Deployed web application: registration, test catalogue, timed test runner, results with explanations, subscription paywall, admin test upload |
| O5 | Fill the platform with content | ≥ 10 complete 40-item Informatics versions prepared from the author's existing UNT Informatics practice versions (2026 specification) |
| O6 | Run a pilot and evaluate | ≥ 30 pilot users; measure test completion rate, score improvement between attempts, SUS usability score and free-to-paid intent (Section 9) |
| O7 | Assess commercialization potential | Unit economics (pricing, costs, break-even), market size estimate and go-to-market plan |
| O8 | Manage the project traceably | YouTrack backlog, Git history linked to tasks, risk register, milestone reports (Section 10) |

## 1.5 Expected outcomes

- A deployed MVP web application (Next.js + PostgreSQL) with source code and tests in this repository.
- An Informatics item bank in UNT format (single-choice, multiple-choice, matching and context-based items with Python code and SQL tables) in Kazakh, with Russian added later.
- A pilot evaluation report with usage metrics and user feedback.
- A commercialization assessment: business model canvas, pricing, unit economics and next steps.
- Project management artefacts: backlog, roadmap, risk register and change log.

## 1.6 Scope

**In scope (MVP)**

- Student registration and login (email + password).
- Catalogue of Informatics mock-test versions (40 items each, UNT structure).
- Timed test runner that imitates the UNT interface: navigation between items, flagging and auto-submit on timeout.
- Automatic scoring following UNT rules (1 point for single choice; partial credit for multiple-choice and matching items).
- Results page with the correct answer, an explanation per item, and a breakdown by specification topic.
- Attempt history and progress chart.
- Freemium model: a limited number of free versions, with full access through a paid subscription (payment provider integration in test mode for the MVP).
- Admin panel: import test versions (JSON/CSV with images), publish and unpublish, view basic statistics.
- Kazakh interface (Russian interface as a stretch goal).

**Out of scope (for this diploma)**

- Other UNT subjects (mathematics, history, etc.).
- Live lessons, video courses and tutoring.
- Native mobile apps (the web app is responsive instead).
- Adaptive or AI-generated questions (named as future work).
- Official affiliation with the National Testing Center.

## 1.7 Engineering complexity

The project goes beyond a simple CRUD website:

- **Domain-specific scoring engine:** UNT partial-credit rules for multiple-choice and matching items, and time-limited sessions that are resistant to page reloads.
- **Rich item rendering:** syntax-highlighted Python code, SQL tables and spreadsheet fragments, plus an import pipeline with validation for item banks.
- **Payments and access control:** subscription states, webhooks and entitlement checks on the server side.
- **Analytics:** per-topic mastery calculation and an event log for the commercialization metrics.
- **Non-functional quality:** performance under concurrent test sessions, security (OWASP Top 10) and automated testing in CI.

## 1.8 Assumptions and constraints

- Single developer and project manager, working part-time alongside coursework, from October 2026 to May 2027.
- Content is written by the author, who already writes UNT Informatics practice versions to the 2026 specification. Items are original and are not copied from NTC materials.
- Budget is limited to free tiers or low-cost hosting (≤ 10,000 KZT per month during the pilot).
