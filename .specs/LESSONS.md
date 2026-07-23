# LESSONS — auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation — do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 — TabLayout tests must mock Tabs to capture screen names, not render as null; otherwise tab count/name changes go undetected
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `app/(tabs)/__tests__/TabLayout.test.tsx` · harmful: 0
- features: fase-1-navegacao
- evidence: app/(tabs)/_layout.tsx:27-30 (Mutation 1) (app/(tabs)/__tests__/TabLayout.test.tsx)
- last seen: 2026-07-06T23:37:41Z

### L-002 — Tab navigator ACs (tab count, tap navigation, active highlight, state preservation) need explicit test assertions — smoke tests on mocked Tabs are insufficient
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `app/(tabs)/__tests__/` · harmful: 0
- features: fase-1-navegacao
- evidence: NAV-01, NAV-02, NAV-03, NAV-04 (app/(tabs)/__tests__/)
- last seen: 2026-07-06T23:37:42Z

### L-003 — When testing Expo Router tab layouts, mock Tabs.Screen to capture screen names and titles rather than mocking Tabs as a no-op. A 'renders without crashing' smoke test cannot detect missing or misconfigured tabs — always assert the expected count, names, and i18n titles.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `navigation testing` · harmful: 0
- features: fase-1-navegacao
- evidence: validation.md: Discrimination Sensor Mutation 1 (navigation testing)
- last seen: 2026-07-06T23:44:08Z

### L-004 — Orchestrator must handle commit division and git versioning across phases — ensure conventional commits, branch strategy, and tagging are enforced per-phase, not left to sub-agents alone.
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `orchestration` · harmful: 0
- features: loop-orchestrator
- evidence: AGENTS.md:loop-orchestrator (orchestration)
- last seen: 2026-07-23T00:50:52Z

## Quarantined (failed when applied — ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
