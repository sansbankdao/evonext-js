# NOTE — `packages/Platform` changes committed but NOT yet reviewed

**Created:** 2026-09-20
**Status:** committed for safekeeping; **review still pending**

---

## Why this note exists

The `packages/Platform` working-tree changes were **not** part of the ECDSA fix.
They were committed on request so the work would not be lost, with an explicit
instruction to review them later. This note is the reminder.

## What was committed

| File | Change |
|---|---|
| `packages/Platform/src/libs/findTransferKeys.ts` | **deleted** (its contents were a `// TBD` stub) |
| `packages/Platform/src/libs/getIdentities.ts` | modified (+2 `// @ts-ignore`) |
| `packages/Platform/src/libs/searchTransferKeys.ts` | **new** (3-line stub) |
| `packages/Platform/src/libs/getTokenBalances.ts` | **new** (live SDK call, top-level await) |

## What still must be checked before this is treated as done

1. `searchTransferKeys.ts` is a stub — confirm it is intentional and not a
   placeholder that was meant to be filled in.
2. `findTransferKeys.ts` was deleted — confirm no consumer still imports it.
3. `getTokenBalances.ts` uses a top-level `await` — confirm the published
   bundle target supports it (the package builds `es2022` via `tsup`).
4. The `@ts-ignore` lines in `getIdentities.ts` — confirm the suppressed errors
   are understood, not hidden.
5. `packages/Platform/pnpm-workspace.yaml` — see below.

## Known defect found during the ECDSA release

- `packages/Platform/pnpm-workspace.yaml` (untracked, not committed) is a
  malformed pnpm-11 placeholder containing literal text
  `set this to true or false`. It must **not** be committed as-is; pnpm 9
  rejects it with `ERROR  packages field missing or empty`. Either delete it
  or replace it with a valid workspace file.
- `packages/Platform` `lint` script is broken: `eslint@9.11.1` removed the
  `--ext` flag, there is no `eslint.config.js` flat config, and
  `@typescript-eslint/*` is absent from `devDependencies`. The repo-root
  `.eslintrc.json` is an ESLint-8 config and is not read by ESLint 9.
  This is pre-existing and unrelated to the ECDSA fix.

## DO NOT FORGET

Delete this file once each item above is resolved.