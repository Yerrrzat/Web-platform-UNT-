# 10. Project Management and Risks

## 10.1 Tools and links

| Artefact | Location |
|---|---|
| Git repository | https://github.com/Yerrrzat/Web-platform-UNT- |
| Submitted version | Git tag `prob-period-1` |
| YouTrack project | https://yerzat-diploma.youtrack.cloud/projects/UNT (project key **UNT**). The backlog is also exported in `youtrack/tasks.csv` |
| Documentation | `docs/` (this report), `diagrams/`, `prototype/` |

## 10.2 Roles and responsibilities

This is an **individual project**, so one person has several roles. The supervisor reviews significant changes at agreed checkpoints, as the repository rules require for individual projects.

| Role | Person | Responsibilities |
|---|---|---|
| Project manager / product owner | Yerzat Qaldyqan | Scope, backlog, priorities, milestones, risk register, stakeholder communication, commercialization analysis |
| Business analyst | Yerzat Qaldyqan | Interviews, requirements, acceptance criteria |
| Developer (full-stack) | Yerzat Qaldyqan | Next.js app, database, payments integration, tests, deployment |
| Content author | Yerzat Qaldyqan | UNT Informatics items, explanations, topic tags |
| Supervisor / reviewer | Zarina Almabekkyzy | Reviews deliverables at checkpoints, approves scope changes, reviews selected pull requests |
| External content reviewer | Informatics teacher (to be confirmed) | Checks one version per batch for correctness |

## 10.3 Way of working

- **Process:** Scrum-like 2-week sprints, run solo. Each sprint has a goal, a backlog in YouTrack and a short review note in `docs/sprint-notes/`.
- **Tasks:** every meaningful work item is a YouTrack issue (`UNT-n`) with an assignee, priority, due date, expected outcome and acceptance criteria. A task is set to *Done* only when its acceptance criteria are met.
- **Git workflow:** `main` is the reviewed baseline. Work happens in branches named `UNT-n-short-name`. Commit messages start with the task ID (for example `UNT-8: Add use case diagram`). Changes are merged through a pull request that references the task and describes how the work was checked. Significant PRs (scoring, billing, security) are reviewed by the supervisor at checkpoints.
- **Traceability:** YouTrack task ↔ branch ↔ PR ↔ commit. Each PR link is added back to the YouTrack task.
- **Definition of Done:** acceptance criteria met, tests pass in CI, documentation updated, PR merged into `main`.

## 10.4 Milestones

| Milestone | Target date | Deliverables | Status |
|---|---|---|---|
| M0 Topic approval | Oct 2026 | Approved diploma topic | Done |
| **M1 Probationary period 1** (`prob-period-1`) | **24 Oct 2026** | Proposal, evidence, literature review, comparisons, requirements, diagrams, prototype, verification plan, PM plan | In progress (this submission) |
| M2 Core MVP (internal) | 19 Dec 2026 | Auth, import, renderer, test session, scoring, results | Planned |
| M3 MVP ready (supervisor checkpoint) | 31 Jan 2027 | Billing (test mode), events/dashboard, 10 versions, deployment | Planned |
| M3a Development complete (supervisor checkpoint) | 28 Feb 2027 | Testing finished, bugs fixed, release for pilot | Planned |
| M4 Pre-defense 2 | Date set by the school (expected Feb 2027) | Working MVP demo, test reports | Planned |
| M5 Pilot complete | 28 Mar 2027 | Pilot data, survey, metrics M1–M9 | Planned |
| M6 Final pre-defense | Date set by the school (expected Apr–May 2027) | Commercialization assessment, final report | Planned |

## 10.5 Backlog snapshot (top items)

| ID | Summary | Priority | Due | State |
|---|---|---|---|---|
| UNT-1 … UNT-11 | Analysis, design and planning deliverables (this report) | Critical/Major | 23 Oct 2026 | Done |
| UNT-3 | Evidence of relevance: 3–5 interviews | Critical | 24 Oct 2026 | In progress |
| UNT-12 | Supervisor review of probationary-period materials | Critical | 24 Oct 2026 | To do |
| UNT-13 | Tag `prob-period-1` and submit the form | Critical | 24 Oct 2026 | To do |
| UNT-14 | Scaffold Next.js app with CI | Critical | 7 Nov 2026 | To do |
| UNT-15 | Database schema and migrations | Critical | 7 Nov 2026 | To do |
| UNT-19 / UNT-20 | Test session + scoring engine | Critical | 5 Dec 2026 | To do |
| UNT-22 | Freemium access and subscription billing | Critical | 16 Jan 2027 | To do |
| UNT-27 | Pilot with ≥ 30 students | Critical | 28 Mar 2027 | To do |
| UNT-28 | Commercialization assessment | Critical | 15 Apr 2027 | To do |

The full backlog (28 issues) is in `youtrack/tasks.csv`.

## 10.6 Risk register

Probability (P) and impact (I) are rated 1–3; score = P × I.

| ID | Risk | P | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R1 | One-person team: workload from other courses delays development | 3 | 3 | 9 | Strict MVP scope (MoSCoW), 2-week sprints, buffer before each milestone, cut *Should/Could* items first | Student |
| R2 | Too few pilot participants (< 30) | 2 | 3 | 6 | Recruit early via teachers and the author's student groups; start recruitment in January; offer free premium access to pilot users | Student |
| R3 | Content errors (wrong keys or explanations) damage trust | 2 | 3 | 6 | Import validator, external teacher review, "report error" button (FR-18) | Student |
| R4 | Unfamiliar stack (Next.js) slows progress | 2 | 2 | 4 | Learning spike in S1–S2; use well-documented libraries; keep a monolith | Student |
| R5 | Payment provider onboarding needs a registered business | 3 | 2 | 6 | Test mode for MVP; `PaymentProvider` abstraction; manual activation fallback; measure intent instead of revenue | Student |
| R6 | Personal data of minors in the pilot | 2 | 3 | 6 | Minimal data, consent forms, pseudonymous analytics, privacy policy, data deletion (NFR-05) | Student |
| R7 | UNT specification changes for 2027 | 2 | 2 | 4 | Topic tags stored as data; follow NTC announcements; content mapped to the latest specification | Student |
| R8 | Free NTC trial reduces willingness to pay | 2 | 2 | 4 | Differentiate on explanations and Informatics depth; test pricing in pilot; position as a complement | Student |
| R9 | Hosting free-tier limits or outages during the pilot | 1 | 2 | 2 | Monitor usage; budget up to 10,000 KZT per month; backups of the database | Student |
| R10 | Copyright concerns about test items | 1 | 3 | 3 | Only original items written to the public specification; no NTC items copied | Student |

## 10.7 Dependencies

| Dependency | Needed for | Risk link |
|---|---|---|
| Supervisor availability for checkpoint reviews | M1, M4, M6 | R1 |
| Teachers/schools for interviews and pilot recruitment | UNT-3, UNT-27 | R2, R6 |
| Payment aggregator test account | UNT-22 | R5 |
| External informatics teacher for content QA | UNT-24 | R3 |
| NTC specification for 2027 | UNT-24 | R7 |
| Hosting/DB providers (Vercel, Neon/Supabase) | UNT-26 | R9 |

## 10.8 Next steps (after prob-period-1)

1. Fill in the interview table (UNT-3) and record the supervisor's feedback (UNT-12).
2. Sprint 2 (from 26 Oct): scaffold the app with CI (UNT-14), database schema (UNT-15), hallway test of the prototype (UNT-25).
3. Sprint 3: authentication, import pipeline and item renderer (UNT-16 … UNT-18).
