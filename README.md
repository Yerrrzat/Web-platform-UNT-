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
| Name | Group | GitHub | Responsibilities |
|---|---|---|---|
| Yerzat Qaldyqan | SE-2408 | [@Yerrrzat](https://github.com/Yerrrzat) | Individual project: project management, analysis, design, development, content, testing |

**Supervisor:** Zarina Almabekkyzy

## Scope
In scope: Informatics only; web (responsive); Kazakh UI; freemium subscription; admin import.
Out of scope: other subjects, live lessons and video, native apps, AI-generated questions. Full list in [docs/01 §1.6](docs/01-project-proposal.md).

## Current status: probationary period 1 (`prob-period-1`, Oct 2026)
- ✅ Proposal, literature review (17 sources), existing systems and technology comparisons
- ✅ Requirements with acceptance criteria, architecture diagrams (PlantUML sources), clickable prototype
- ✅ Verification and evaluation plan, project management plan, risk register, YouTrack backlog
- ⏳ User interviews (in progress), supervisor feedback log
- ⏭ Next: application scaffold with CI (UNT-14), database schema (UNT-15)

No runnable application code yet; this is expected at this stage. Setup instructions will be added with UNT-14.

## Selected technologies
Next.js (TypeScript) · PostgreSQL + Prisma · Auth.js · local payment aggregator (test mode) · Vitest + Playwright · GitHub Actions · Vercel + Neon/Supabase. Rationale: [docs/05](docs/05-technology-comparison.md).

## Links
- **YouTrack:** _insert project link_ (key `UNT`); backlog export: [youtrack/tasks.csv](youtrack/tasks.csv)
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
src/             application code (from UNT-14)
tests/           automated tests and test log
config/          configuration examples (no secrets)
youtrack/        backlog export
```

## Setup, run, test
_Will be added with UNT-14 (Next.js scaffold + CI)._ To regenerate diagrams now:
```bash
java -jar plantuml.jar -tpng -o ../png diagrams/src/*.puml
```

## Workflow
Branch `UNT-<id>-short-name` → commit `UNT-<id>: message` → Pull Request referencing the task → review → merge to `main`. Submissions are tagged `prob-period-1`, `pre-defense-2`, `final-pre-defense`.
