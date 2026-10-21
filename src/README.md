# Source code
Application code (Next.js + TypeScript) will be added with **UNT-14**. Planned module layout, matching the component diagram (docs/07):
```
src/app/            routes: catalogue, test/[attemptId], results/[attemptId], pricing, admin
src/modules/auth
src/modules/catalogue
src/modules/session      timer, autosave, resume
src/modules/scoring      pure functions, UNT rules
src/modules/results
src/modules/billing      PaymentProvider interface, webhook
src/modules/content      import + JSON schema validation
src/modules/events
src/lib/db               Prisma client, repositories
prisma/schema.prisma
```
