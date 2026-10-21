# 5. Technology Comparison

Each decision is scored against criteria derived from the requirements (Section 6) and the project constraints: one developer, a short timeline, a low budget, and a need for server-side rendering and SEO for marketing pages. Scores are 1 (poor) to 5 (best); weights add up to 100%.

## 5.1 Decision 1: Web application framework (frontend + server)

| Criterion (weight) | **Next.js (React, App Router)** | Django + templates/HTMX | Separate React SPA + Express API |
|---|---|---|---|
| Interactive test runner UI with timer and state (25%) | 5 | 3 | 5 |
| SEO and fast first load for landing/pricing pages (15%) | 5 (SSR/SSG) | 4 | 2 (client-only rendering) |
| Developer productivity for one person, single codebase (20%) | 5 (full-stack TypeScript) | 4 | 3 (two apps to maintain) |
| Ecosystem: auth, payments, UI kits (15%) | 5 | 4 | 4 |
| Hosting cost and simplicity (15%) | 4 (Vercel/Render free tier) | 3 | 3 |
| Author's existing skills (10%) | 3 | 4 (Python) | 3 |
| **Weighted score** | **4.65** | 3.60 | 3.50 |

**Decision: Next.js with TypeScript.** It gives one codebase for UI and API (Route Handlers and Server Actions), SSR for marketing pages and a rich interactive runner. **Trade-off:** less familiar to the author than Python, which is mitigated by a learning spike in Sprint 1 (YouTrack UNT-6).

## 5.2 Decision 2: Data storage

| Criterion (weight) | **PostgreSQL** | MongoDB | Firebase Firestore |
|---|---|---|---|
| Relational integrity: users–subscriptions–attempts–answers (30%) | 5 | 3 | 2 |
| Analytical queries (topic mastery, conversion funnels) in SQL (20%) | 5 | 3 | 2 |
| Flexible item content (JSON for code/table blocks) (15%) | 4 (JSONB) | 5 | 4 |
| Transactions for payment and entitlement updates (15%) | 5 | 4 | 3 |
| Free/managed hosting (Neon, Supabase, Render) (10%) | 5 | 4 | 4 |
| Vendor lock-in risk (10%) | 5 (open standard) | 4 | 2 |
| **Weighted score** | **4.85** | 3.65 | 2.65 |

**Decision: PostgreSQL** with Prisma ORM for migrations and type-safe queries. Item bodies with code or table blocks are stored as validated JSONB. **Trade-off:** a schema change needs a migration, which is acceptable and also gives a traceable history.

## 5.3 Decision 3: Component interaction and API style

| Criterion (weight) | **Server Actions + REST route handlers (monolith)** | GraphQL API | Microservices (separate scoring/payment services) |
|---|---|---|---|
| Simplicity for MVP and one developer (35%) | 5 | 3 | 1 |
| Clear contract for webhooks (payment provider) (20%) | 5 (REST endpoint) | 3 | 4 |
| Performance for a test session (load once, submit once) (20%) | 5 | 4 | 3 |
| Testability (15%) | 4 | 4 | 3 |
| Future scalability (10%) | 3 | 4 | 5 |
| **Weighted score** | **4.65** | 3.45 | 2.70 |

**Decision: modular monolith.** Internal modules (auth, catalogue, test session, scoring, billing, admin) have clear boundaries (see the component diagram, Section 7). External integrations use REST: the payment webhook and the import endpoint. **Trade-off:** scaling means scaling the whole app, which is acceptable for the expected pilot load (< 500 concurrent users).

## 5.4 Decision 4: Payments (subscription)

| Criterion (weight) | **Kaspi Pay / local acquiring (via aggregator, e.g. CloudPayments KZ)** | Stripe | Manual (Kaspi transfer + admin activation) |
|---|---|---|---|
| Availability for a Kazakhstani merchant and payers (35%) | 5 | 2 (not directly available to KZ merchants) | 5 |
| Recurring payments and webhooks (25%) | 4 | 5 | 1 |
| Test mode for development (20%) | 4 | 5 | 1 |
| Fees and setup effort (20%) | 3 | 3 | 5 |
| **Weighted score** | **4.15** | 3.55 | 3.20 |

**Decision:** integrate a local aggregator's **test mode** during the MVP. Billing sits behind an interface (`PaymentProvider`), so the provider can be switched. Manual activation is the fallback for the first pilot customers. Final choice of provider will be made after the legal registration of the business (risk R5).

## 5.5 Supporting choices (not weighted)

| Area | Choice | Alternatives considered | Reason |
|---|---|---|---|
| Auth | Auth.js (NextAuth) credentials + email verification | Clerk, Firebase Auth | Free, self-hosted, no user data sent to third parties |
| Hosting | Vercel (app) + Neon/Supabase (PostgreSQL) | Render, VPS (PS Cloud) | Free tiers for the pilot; a VPS in Kazakhstan if data-residency requirements apply |
| Testing | Vitest (unit), Playwright (E2E) | Jest, Cypress | Fast, TypeScript-native, CI-friendly |
| CI | GitHub Actions | GitLab CI | Repository is on GitHub |
| Code highlighting | Shiki | Prism | Server-side rendering, accurate Python grammar |
| Diagrams | PlantUML (sources in `diagrams/src`) | draw.io | Text-based, versioned in Git |
