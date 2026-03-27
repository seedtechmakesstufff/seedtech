---
globs:
  - "prisma/**"
  - "src/lib/prisma.ts"
---

# Prisma Conventions

## Schema Patterns
- Every data model has `siteId String` with `@relation(fields: [siteId], references: [id], onDelete: Cascade)`
- Composite unique keys: `@@unique([siteId, slug])`, `@@unique([siteId, url])`, `@@unique([siteId, domain])`
- Use `@default(uuid())` for IDs
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`

## Connection
- Provider: Neon serverless PostgreSQL via `@prisma/adapter-neon`
- Client singleton: `src/lib/prisma.ts` (pooled connection)
- Generated to: `src/generated/prisma` (gitignored)

## Query Patterns
- Always filter by siteId: `prisma.model.findMany({ where: { siteId } })`
- Use `upsert` for config-style models (BusinessProfile, EmailConfig, IndustryConfig)
- Paginate large result sets with `take` + `skip`

## Migration Strategy
- `npx prisma db push` for development iteration
- `npx prisma migrate dev` for production migrations
- When adding siteId to existing models: create default tenant/site first, backfill, then enforce
