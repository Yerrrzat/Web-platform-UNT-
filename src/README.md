# Source code
Next.js 15 + TypeScript. Module layout follows the component diagram (docs/07):
```
src/app/                 pages and API routes
  page.tsx               catalogue of test versions (home page)
  login, register        authentication forms
  account/               profile and settings, subscription, security
  test/[attemptId]       timed test runner
  results/[attemptId]    results with explanations and topic breakdown
  history                attempt history
  admin/analytics        pilot metrics dashboard (admins)
  api/attempts/…         test session API
  api/admin/events       CSV export of analytics events
src/modules/auth         password hashing, session token, validation, register/login
src/modules/billing      freemium rules, subscriptions, payments (test mode)
src/modules/catalogue    published versions with access locks
src/modules/session      timer rules, autosave, resume, submit
src/modules/scoring      pure functions, UNT scoring rules
src/modules/results      results, topic breakdown, history
src/modules/analytics    pilot metrics, CSV
src/modules/events       product analytics events
src/components           UI components (test runner, forms, charts)
src/i18n/kk.ts           Kazakh UI strings
prisma/schema.prisma     data model
```
