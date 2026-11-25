# UNT Informatics Prep: MVP Web Platform

> Diploma project (startup track), Astana IT University, 2026–2027
> **Title:** Managing the development of an MVP web platform for Unified National Testing (UNT) preparation in Computer Science and assessing its commercialization potential

A web platform where school students preparing for the UNT (ҰБТ / ЕНТ) on the Mathematics–Informatics profile take realistic, timed **Informatics mock tests**. After each test they get **an explanation for every item** and **a breakdown by specification topic**. The platform uses a **freemium** model: free versions with full explanations, and a paid subscription for the full test bank and progress history.

## Problem
General UNT preparation services treat Informatics as a minor subject. Their content lags behind the current item types (Python code, SQL tables), and they usually show only a score or the correct letter. Full courses are expensive. Students who need focused Informatics practice with feedback have no cheap, dedicated option. Details: [docs/01](docs/01-project-proposal.md), [docs/02](docs/02-evidence-of-relevance.md).

## Target users
- **Primary:** grade 10–11 UNT candidates (Mathematics–Informatics profile), in Kazakh first and Russian later
- **Secondary:** informatics teachers and tutors
- **Operator:** platform administrator (content owner)

## Expected outcomes
Deployed MVP (catalogue, timed test runner, UNT scoring, explanations, topic analytics, subscription in test mode, admin import), ≥ 10 Informatics versions, pilot with ≥ 30 students, and a commercialization assessment.

## Team
| Name | Programme | GitHub | Role and responsibilities |
|---|---|---|---|
| Yerzat Qaldyqan | Software Engineering, SE-2408 | [@Yerrrzat](https://github.com/Yerrrzat) | Full-stack development: frontend (catalogue, account, test runner, results), backend, database, authentication, subscription, CI, content |
| Ulnur Niyetbay | IT Management, ITM-2401 | — | Analytics and management: pilot metrics and dashboard, conversion funnel, CSV export, evaluation plan, commercialization assessment |

**Supervisor:** Zarina Almabekkyzy

## Scope
In scope: Informatics only; web (responsive); Kazakh UI; freemium subscription; admin import.
Out of scope: other subjects, live lessons and video, native apps, AI-generated questions. Full list in [docs/01 §1.6](docs/01-project-proposal.md).

## Current status: first working release (Nov 2026)
- ✅ Probationary period 1 documents (`prob-period-1`)
- ✅ App scaffold with CI (UNT-14), database schema (UNT-15)
- ✅ Registration, login, account settings, password change (UNT-16)
- ✅ Timed test session with autosave, resume and offline retry (UNT-19); UNT scoring engine (UNT-20)
- ✅ Results with explanations and topic breakdown, attempt history (UNT-21)
- ✅ Freemium access and subscription in test mode, payment history (UNT-22)
- ✅ Admin analytics: activation, completion, score growth, conversion, funnel, CSV export (UNT-23)
- ⏭ Next: version import in the admin panel (UNT-17), real payment provider, Russian UI, deployment in Kazakhstan

## Selected technologies
Next.js 15 (TypeScript) · PostgreSQL + Prisma · own session auth (bcrypt + signed httpOnly cookie) · local payment aggregator (test mode for now) · Vitest · GitHub Actions · hosting in Kazakhstan (personal data law). Rationale: [docs/05](docs/05-technology-comparison.md).

## Links
- **YouTrack:** https://yerzat-diploma.youtrack.cloud/projects/UNT (key `UNT`, board "Разработка проекта UNT"); backlog export: [youtrack/tasks.csv](youtrack/tasks.csv)
- **Prototype:** [prototype/index.html](prototype/index.html) (open in a browser) · online (GitHub Pages): https://yerrrzat.github.io/Web-platform-UNT-/prototype/
- **Documentation:**
  1. [Project proposal](docs/01-project-proposal.md)
  2. [Evidence of relevance](docs/02-evidence-of-relevance.md)
  3. [Literature review](docs/03-literature-review.md)
  4. [Existing system comparison](docs/04-existing-systems-comparison.md)
  5. [Technology comparison](docs/05-technology-comparison.md)
  6. [Requirements specification](docs/06-requirements-specification.md)
  7. [Architecture and diagrams](docs/07-architecture-and-diagrams.md)
  8. [UX / prototype](docs/08-ux-prototype.md)
  9. [Verification and evaluation plan](docs/09-verification-and-evaluation-plan.md)
  10. [Project management and risks](docs/10-project-management-and-risks.md)
  11. [Supervisor feedback](docs/11-supervisor-feedback.md)

## Repository structure
```
docs/            report sections 1–11, sprint notes
diagrams/src/    editable PlantUML sources
diagrams/png/    rendered diagrams
prototype/       clickable HTML prototype + screenshots
src/             application code (Next.js)
prisma/          database schema and seed data
tests/           automated tests and test log
config/          configuration examples (no secrets)
youtrack/        backlog export
```

## Setup, run, test
Requirements: Node.js 20+ and PostgreSQL 16 (Docker Desktop or a local install).

```bash
npm install                      # also generates the Prisma client
cp config/.env.example .env      # Windows: copy config\.env.example .env
docker compose up -d             # or your own PostgreSQL: edit DATABASE_URL in .env
npx prisma migrate dev --name init
npm run db:seed                  # 2 versions (free + premium), topics, dev accounts
npm run db:seed-demo             # optional: 15 demo students for the analytics dashboard
npm run dev                      # http://localhost:3000
```

Development accounts (local only): `demo@unt.kz` / `Demo12345` (student), `admin@unt.kz` / `Admin12345` (admin).

Tests:
```bash
npm test                 # unit + integration tests (integration needs the database)
npm run test:coverage
npm run lint && npm run typecheck
```

| Page | Address |
|---|---|
| Catalogue of versions (home) | `/` |
| Login, registration | `/login`, `/register` |
| Account: profile, subscription, security | `/account`, `/account/subscription`, `/account/security` |
| Test, results, history | `/test/:id`, `/results/:id`, `/history` |
| Analytics (admin) | `/admin/analytics` |

To regenerate diagrams:
```bash
java -jar plantuml.jar -tpng -o ../png diagrams/src/*.puml
```

## Workflow
Branch `UNT-<id>-short-name` → commit `UNT-<id>: message` → Pull Request referencing the task → review → merge to `main`. Submissions are tagged `prob-period-1`, `pre-defense-2`, `final-pre-defense`.
