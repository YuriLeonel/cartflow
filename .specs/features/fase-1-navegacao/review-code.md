# Code Review — `feature/fase-1-navegacao`

> Review focused on **code quality** and **security**. Branch adds bottom tab navigation (4 tabs) with placeholder screens, i18n in pt-BR, and unit tests.

## Verdict: ✅ Approved

Lint: clean | Typecheck: clean | Tests: 5 suites, 7 tests — all pass

---

## Code Quality

### Good practices observed
- TypeScript strict mode enabled (`tsconfig.json:4`)
- Constants extracted (`constants/colors.ts`, `constants/layout.ts`) — no magic values leaked into screens
- i18n strings centralized in `i18n/locales/pt-BR.json` — no hardcoded user-facing text
- `SafeAreaContext` used on every screen — correct behavior on notched devices
- Expo Router file-based routing — follows framework convention
- Tests cover rendering + i18n title correctness per screen

### Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| Q1 | **Minor** | `app/(tabs)/_layout.tsx:23` | Magic number `fontSize: 22` — extract to a constant in `constants/layout.ts` |
| Q2 | **Minor** | `app/(tabs)/index.tsx:40` | Expression `spacing.sm + 4` — prefer a named constant |
| Q3 | **Minor** | `app/(tabs)/_layout.tsx:23` | Emoji tab icons lack accessibility. Add `accessibilityLabel` (or `accessibilityRole: 'tab'`) to the `<Text>` icon |
| Q4 | **Info** | `app/(tabs)/lists.tsx`, `products.tsx`, `profile.tsx` | 3 placeholder screens are structurally identical. Acceptable at this stage (YAGNI — they'll diverge when implemented) |

## Security

### Risk profile: **Very Low**

This branch is a pure navigation/scaffold phase with no user input, no network calls, no storage access, and no third-party scripts. No security issues were found.

### Passive review (security best practices)

| Rule ID | Severity | Finding |
|---------|----------|---------|
| REACT-CONFIG-001 | ✅ OK | No secrets in client bundle |
| REACT-XSS-001 | ✅ OK | No `dangerouslySetInnerHTML` |
| REACT-XSS-002 | ✅ OK | All content via JSX interpolation (escaped by default) |
| REACT-DOM-001 | ✅ OK | No DOM injection sinks |
| REACT-URL-001 | ✅ OK | No URL handling yet |
| REACT-AUTH-001 | ✅ OK | No tokens / session storage |
| REACT-NET-001 | ✅ OK | No network calls |
| REACT-REDIRECT-001 | ✅ OK | No redirect logic |
| REACT-POSTMSG-001 | ✅ OK | No postMessage usage |
| REACT-SUPPLY-001 | ⚠️ Note | Lockfile present (`package-lock.json`). CI should use `npm ci`. Run `npm audit` before next phase for a baseline |

## Recommendations before proceeding to next phase

1. **Add accessibility** to tab bar icons (`accessibilityLabel`, `accessibilityRole`)
2. **Run `npm audit`** to establish a security baseline before adding features with user input / network
3. **Extract the `22` font size** and `spacing.sm + 4` into constants for consistency
