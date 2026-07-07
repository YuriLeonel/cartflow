# Cartflow — AGENTS.md

## Project status

Greenfield React Native mobile app. Scaffold complete (Expo SDK 57, Expo Router 4, TypeScript strict). Core tooling installed and configured. Ready for feature development.

## Authority

AGENTS.md is **authoritative** — agents must follow it unless explicitly overridden by the user. At the end of every session, review what happened against this file and suggest improvements (new gotchas, refined commands, evolved conventions). This file stays lean: every line must answer "would an agent likely miss this without help?"

## Core requirements

- **Platform**: React Native (Expo managed workflow, SDK 57)
- **App**: Shopping list with cart creation, product pricing, cart tracking, expected vs current price comparison
- **Reference**: SoftList (`br.com.ridsoftware.shoppinglist`) — product catalog, barcode scanning, categories, purchase history, price reports, cloud sync
- **i18n**: All user-facing text in Portuguese. Use `i18next` + `react-i18next` + `expo-localization`. Codebase stays in English (variable names, comments, file names, etc.)
- **Workflow**: TLC Spec-driven (`tlc-spec-driven` skill) — spec → design → tasks → implement → validate
- **Branching**: Git Flow (`main` → `develop` → `feature/*`, `release/*`, `hotfix/*`)
- **Mandatory**: Unit tests (Jest) + security best practices (`security-best-practices` skill)

## Skills to use (installed in `.opencode/skills/`)

| When | Skill |
|------|-------|
| Planning a feature | `brainstorming` → `writing-plans` |
| Feature dev workflow | `tlc-spec-driven` (spec → design → tasks → implement → validate with atomic commits) |
| Building screens | `react-native-expert` |
| Performance review | `react-best-practices` |
| Security review | `security-best-practices` |
| Accessibility | `accessibility` |
| Figma design handoff | `figma` / `figma-implement-design` |
| Testing browser flows | `playwright-skill` |
| Docs / README | `docs-writer` |
| Before claiming done | `verification-before-completion` (run tests, lint, typecheck) |

## Coding principles

- **Clean Code**: Meaningful names, small focused functions, no commented-out code
- **DRY**: Extract duplication into shared utilities or hooks — but not at the cost of clarity
- **YAGNI**: Build only what the current spec requires. No speculative abstractions
- **KISS**: Simple over clever. Prefer flat structures over deep nesting. Do not introduce layers (repositories, services, etc.) unless the current spec demands it
- **Atomic Design**: Build UI from atoms → molecules → organisms → templates → pages. Colocate related files

## Key conventions

- **State management**: Zustand 5 + MMKV (persist middleware)
- **Storage**: MMKV (primary key-value), expo-sqlite (consider for complex queries later)
- **Navigation**: Expo Router 4 (file-based, native-stack)
- **API**: TBD — likely REST or GraphQL for cloud sync (later phase)
- **Monorepo**: Not yet. Keep single package until justified.
- **Lint/format**: Biome
- **Lists**: @legendapp/list
- **Images**: expo-image
- **Animations**: react-native-reanimated 4 + react-native-worklets
- **Gestures**: react-native-gesture-handler

## Roadmap

The full MVP roadmap is defined in `docs/ROADMAP.md`. Always read it at the start of a session to understand the current phase and next steps. Each feature follows the `ROADMAP.md` phase order.

## Setup complete

Project already scaffolded. No need to run `create-expo-app` again.

## Verification commands

```bash
npm run lint          # biome check .
npm run typecheck     # tsc --noEmit
npm run test          # jest
npm run format        # biome format --write .
npx expo start        # dev server
```

## Gotchas

- **Expo SDK 57** is installed (resolved from `latest`). Package versions via `npx expo install` auto-match SDK. Never pin versions manually for Expo-managed packages.
- **Reanimated 4 is a Babel plugin, not an Expo config plugin** — `react-native-reanimated` must NOT be in `app.json` → `plugins`. It's handled by `babel-preset-expo` + `react-native-worklets` (explicit dependency).
- **`babel.config.js`** must exist with `babel-preset-expo`. Without it, Metro fails to start.
- **Portuguese i18n only** — all user-facing strings in Portuguese (`pt-BR`). Code (vars, comments, files) stays in English. English locale is not needed
- **`jest-expo` preset** configured; Jest version must align with `jest-expo@57` (Jest 29, not 30). Do not pin a different Jest major version.
- **React 19.2.3** is pinned — do not upgrade. `react-dom` peer conflicts arise from web-only transitive deps (Radix UI via expo-router). Use `--legacy-peer-deps` when needed. React DOM is irrelevant for RN.
- **Never run `npm audit fix --force`** — it may bump React/RN pins and break alignment with Expo SDK 57. Review audit results manually.
- **Biome v0.3.3** installed — linter, formatter, import organizer
- **Git Flow means** `develop` is the default branch for day-to-day work; `main` is production releases only
- **TLC Spec-driven flow** writes specs to `docs/superpowers/specs/` — keep this structure
- **Unit tests** must be in `__tests__/` or co-located as `*.test.ts` — verify pattern before choosing
