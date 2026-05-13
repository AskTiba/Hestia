# Error Log: ShopMaster

This file tracks technical issues, their causes, and how we resolved them.

| Date | Problem | Cause | Solution |
| :--- | :--- | :--- | :--- |
| 2026-05-13 | `ENOSPC: failed copying files...` | Disk is full (only ~270MB free). | **Resolved**: User freed up ~49GB. |
| 2026-05-13 | `nest : The term 'nest' is not recognized` | NestJS CLI is not installed globally. | Used `bunx @nestjs/cli` to run it without global installation. |
| 2026-05-13 | `P1012: The datasource property url is no longer supported` | Prisma 7 requires URLs in `prisma.config.ts`. | Removed `url` from `schema.prisma` and ensured it's in `prisma.config.ts`. |
| 2026-05-13 | `nest generate : Cannot find module './core'` | Corrupted `node_modules` or `ajv` package in CLI path. | Re-running `bun install`. Will manual scaffold if needed. |
| 2026-05-13 | `Prisma Studio: ERR_STREAM_UNABLE_TO_PIPE` | Known Bun/Prisma compatibility issue on Windows. | Verified connection via `db pull`. Recommended using `npx` for Studio if needed. |
