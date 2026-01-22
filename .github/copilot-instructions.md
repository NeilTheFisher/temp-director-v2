# Director v2 - AI Agent Instructions

## Architecture Overview

**Turborepo Monorepo Structure:**

- `apps/web/` - Next.js 16 fullstack app (port 3001)
- `packages/api/` - oRPC business logic layer
- `packages/auth/` - Better-Auth with Polar.sh payment integration
- `packages/db/` - Prisma ORM with MySQL + generated Zod schemas

**Technology Stack:**

- Runtime: Bun (package manager + runtime)
- Framework: Next.js 16 with React 19
- API: oRPC (type-safe RPC with OpenAPI) - NOT tRPC
- ORM: Prisma with MySQL
- Auth: Better-Auth (NOT NextAuth)
- Validation: Zod (v4.x)
- Styling: TailwindCSS v4 + shadcn/ui
- Linting: Biome (NOT ESLint) + oxlint

## oRPC API Pattern (Critical) - Contract-First with Single Implement

Uses **contract-first approach** with a **single `implement()` call** for better separation of concerns and type safety:

### Pattern Structure:

1. **Define schemas** in `packages/api/src/schemas/` - Zod validation schemas
2. **Define contracts** in `packages/api/src/contract/` using `oc` from `@orpc/contract`
3. **Combine contracts** in `packages/api/src/contract/index.ts` - Merge all sub-contracts
4. **Create pub/authed procedures** in `packages/api/src/lib/orpc.ts` - **Single `implement(appContract)` call here**
5. **Implement handlers** in `packages/api/src/routers/` - Each router uses `pub` or `authed` procedures
6. **Combine routers** in `packages/api/src/routers/index.ts` - Export final `appRouter`

### Implementation:

```typescript
// lib/orpc.ts - Single implement() call
import { implement, ORPCError } from "@orpc/server";
import { appContract } from "../contract";

export const pub = implement(appContract).$context<Context>();

export const authed = pub.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({ context: { session: context.session } });
});

// routers/user.ts - Use pub/authed procedures
import { authed } from "../lib/orpc";
export const userRouter = {
  getUserInfo: authed.user.getUserInfo.handler(async ({ context }) => {
    // Full type safety from contract
    return { id: 1, msisdn: "...", email: "..." };
  }),
};

// routers/index.ts - Combine all routers
export const appRouter = {
  health: healthRouter,
  events: eventRouter,
  odience: odienceRouter,
  stream: streamRouter,
  user: userRouter,
};
```

### Key Points:

- **Single `implement(appContract)` in `lib/orpc.ts`** - All type safety flows from this one call
- **Nested contract structure** - Contracts organized by feature (health, events, user, etc.)
- **Procedure inheritance** - `authed` extends `pub` with auth middleware
- **Handler typing** - `.handler()` ensures return types match schema
- **Context:** Created in `packages/api/src/context.ts` using Better-Auth's `auth.api.getSession()`.
- **Handler Registration:** Routers exposed via Next.js at `/api/rpc/[[...rest]]/route.ts`.

## Database Pattern

**Prisma Location:** Schema files in `packages/db/prisma/schema/`, generated client in `packages/db/prisma/generated/`.

**Key Commands:**

- `bun run db:studio` - Open Prisma Studio
- `bun run db:generate` - Generate Prisma client + Zod schemas
- `bun run db:migrate` - Run migrations

**Usage:** Import `prisma` from `@director_v2/db` - it's a singleton PrismaClient instance.

## Authentication

**Better-Auth** (not NextAuth) with Polar.sh integration for payments. Session management via cookies. Auth API exposed at `/api/auth/[...all]`.

**Protected Routes:** Use `protectedProcedure` which throws `ORPCError("UNAUTHORIZED")` if no session.

## Development Workflow

**Start Dev Server:** `bun run dev` (runs all packages via Turborepo)

- Web app: http://localhost:3001
- API reference: http://localhost:3001/api/rpc/api-reference

**Single App Dev:** `bun run dev` (web only)

**Type Checking:** `bun run lint`

**Formatting:** Biome handles formatting (tabs, double quotes). Config in `biome.json`.

## Code Style Conventions

**Formatting:** Tab indentation, double quotes (enforced by Biome)

**Imports:** Use workspace aliases:

- `@director_v2/api` - API package
- `@director_v2/auth` - Auth package
- `@director_v2/db` - Database package
- `@director_v2/env` - Environment variables package

**Error Handling:** Use `ORPCError` from `@orpc/server` with error codes like `"UNAUTHORIZED"`, `"BAD_REQUEST"`, `"INTERNAL_SERVER_ERROR"`.

**Type Safety:**

- Always use `unknown` for catch blocks, not `any`
- Try to avoid adding typescript types and rather let things type themselves. like function return types for example, try to avoid them.

## Migration Context (Important)

This is a **v2 rewrite** of legacy Odience platform:

- **director/** - PHP Laravel app (v1)
- **router/** - Node.js/TypeScript WebSocket router (v1)
- **director-api/** - Express.js API (v1)
- **director_v2/** - This codebase (Next.js/oRPC rewrite)

**Integration:** v1 and v2 run side-by-side. See `director/dev-run-with-v2.sh` for dual deployment.

## Testing & Quality

**No test setup yet** - tests need to be added.

**Husky Git Hooks:** Pre-commit runs oxlint via lint-staged.

**Catalog Dependencies:** Shared versions defined in root `package.json` workspace catalog (Next.js, oRPC, Prisma, etc.).

## Documentation Hygiene (Keep Repo Clean)

- Do not create new `.md` files anywhere in the repo unless explicitly requested by the user for a specific path and purpose.
- Do not generate ad-hoc summaries or change logs as repository files (e.g., `QUICKSTART.md`, `IMPLEMENTATION.md`, `ARCHITECTURE.md`). If a summary is needed, include it in the PR description or the task response, not as a committed file.
- Prefer updating existing documentation files only when the user asks for it; otherwise, keep changes limited to code related to the task.
- Use `get_changed_files` solely to inspect changes; never emit companion Markdown artifacts summarizing diffs.
- Keep diffs minimal and scoped: only touch files directly relevant to the requested change.
- Single source of process guidance is this file. NEVER add instructions, summaries, or meta-docs elsewhere in the codebase.

## Common Pitfalls

1. **Don't use tRPC patterns** - this uses oRPC (different API)
2. **Biome, not ESLint** - different rule syntax
3. **Prisma client path** - import from `@director_v2/db`, not direct prisma import
4. **Zod v4** - newer syntax than v3 examples

## Key Files to Reference

- `packages/api/src/index.ts` - Procedure definitions
- `packages/api/src/routers/index.ts` - Main router structure
- `apps/web/src/app/api/rpc/[[...rest]]/route.ts` - HTTP handler setup

## Other info

- zod schemas have been generated from the prisma schema and can be found using `import { YourSchema } from '@director_v2/db'`.
- NEVER create any summary documents or explanations outside of this copilot-instructions.md file.
