# Code Review — `feature/fase-2-catalogo`

**Reviewer:** opencode automated review
**Date:** 2026-07-11
**Branch:** `feature/fase-2-catalogo` (6 commits ahead of `develop`)
**Scope:** Fase 2 — Catálogo de Produtos (product catalog feature)

---

## 1. Executive Summary

The `feature/fase-2-catalogo` branch delivers a working product catalog: ProductStore with MMKV persistence, Products screen with search and category grouping, and a ProductForm modal with validation. All verification commands pass cleanly.

**Verification evidence (fresh runs):**

| Command | Result |
|---------|--------|
| `npm run lint` (Biome) | 29 files checked, 0 issues |
| `npm run typecheck` (tsc --noEmit) | Clean, 0 errors |
| `npm run test` (Jest) | 7 suites, 43 tests, all passing |
| `npm audit` | 21 vulnerabilities (6 high, 15 moderate) |

**Key issues found: 22**

| Severity | Count | Summary |
|----------|-------|---------|
| Medium | 7 | expo-font misconfiguration, duplicate Cart type, documentation version drift, accessibility gaps, npm audit CVEs |
| Low | 10 | Missing persist versioning, Date.now() IDs, hardcoded styles, inconsistent padding, missing tests, .gitignore gap, small touch targets |
| Informational | 5 | Empty scaffold dirs, unused deps, verification passing |

**Bottom line:** No runtime crashes. The branch is functionally complete but has configuration debt (expo-font/splash screen), a type inconsistency that will bite when cart items ship, and accessibility gaps on form inputs. None are merge-blockers for an internal dev branch, but the expo-font and Cart type issues should be fixed before the next phase.

---

## 2. Branch State & Overview

```
Branch:     feature/fase-2-catalogo (local only, not pushed)
Base:       develop
Commits:    6 ahead of develop
Diff:       16 files changed, +1766 / -28 lines
Working tree: clean
```

**Commits (newest first):**

```
f52de2d refactor(phase-2): shared MMKV storage, i18n consistency, form DRY, dev tooling
308d09d feat(products): add product registration form with validation
2894829 feat: add search functionality to products screen (Task 2.3)
be1bf90 feat(products): implement product list screen with category grouping
66b219e feat: add ProductStore with MMKV persistence and seed data
940acf5 docs(spec): add Fase 2 - Catálogo de Produtos spec, design and tasks
```

**Changed files vs develop:**

| File | Lines | Description |
|------|-------|-------------|
| `app/product-form.tsx` | +224 | Product registration form (new) |
| `app/(tabs)/products.tsx` | +231/-2 | Product list with search (new) |
| `app/__tests__/ProductForm.test.tsx` | +131 | Form tests (new) |
| `stores/useProductStore.ts` | +135 | Product CRUD store (new) |
| `stores/__tests__/useProductStore.test.ts` | +237 | Store tests (new) |
| `app/(tabs)/__tests__/ProductsScreen.test.tsx` | +122/-2 | Screen tests (new) |
| `.specs/features/fase-2-catalogo/*` | +642 | Spec, design, tasks docs |
| `i18n/locales/pt-BR.json` | +25 | New translation keys |
| `lib/storage.ts` | +9 | MMKV adapter (new) |
| `app/_layout.tsx` | +7 | Product form screen added to Stack |
| `stores/useCartStore.ts` | +10/-2 | Shared storage import |
| `biome.json` | +3 | Ignore paths |
| `package.json` / `package-lock.json` | +16 | Dependencies |

---

## 3. expo-font Issue — Root Cause & Fix

This is the **reported build issue**. The root cause is a misconfiguration: `expo-font` is registered as a plugin but never actually used.

### 3.1 What's configured

- `expo-font ~13.0.4` is in `package.json:10`
- `expo-font` is listed as a plugin in `app.json:35`
- `assets/fonts/` directory exists but is **empty**
- `expo-splash-screen ~0.29.24` is in `package.json:15` but **never imported or used**

### 3.2 What's missing

1. **No font loading code anywhere.** Zero calls to `useFonts()` or `Font.loadAsync()` in the entire codebase.
2. **No font files.** The `assets/fonts/` directory is empty — no `.ttf`, `.otf`, or `.woff` files.
3. **No splash screen guard.** `SplashScreen.preventAutoHideAsync()` is never called, so the splash screen may dismiss before fonts (if they existed) are loaded, causing a flash of unstyled text or a brief white screen.
4. **No splash config in app.json.** The `"splash"` key is entirely missing from `app.json`, so Expo uses default splash screen settings.

### 3.3 Why this causes build issues

The `expo-font` plugin runs at build time to bundle font assets. With no fonts to bundle, the plugin either:
- Produces a warning during the native build phase
- Fails silently but adds dead configuration that can confuse EAS builds
- Causes issues when `expo-font` tries to generate native font references for non-existent files

### 3.4 Recommended fix

**Option A — Remove unused plugin (if no custom fonts needed now):**
```diff
// app.json
"plugins": [
  ["expo-router", { "origin": "https://cartflow.app" }],
-  "expo-asset",
-  "expo-font"
+  "expo-asset"
]
```
Also remove `expo-font` from `package.json` dependencies.

**Option B — Properly set up font loading (if custom fonts are planned):**
1. Add `.ttf` font files to `assets/fonts/`
2. Add to root layout:
```tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // font definitions here
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return ( /* ... */ );
}
```
3. Add `"splash"` config to `app.json`:
```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#FAFAF5"
}
```

---

## 4. i18n Status

### 4.1 Configuration — Clean

| Aspect | Status | Details |
|--------|--------|---------|
| Config file | OK | `i18n/index.ts` — standard i18next + react-i18next + expo-localization |
| Dependencies | OK | All installed: i18next@^23.16.0, react-i18next@^15.1.0, expo-localization@~16.0.0 |
| Import pattern | OK | Side-effect import `import '../i18n'` in `app/_layout.tsx:4` |
| Translation keys | OK | All `t()` calls verified against `pt-BR.json` — no missing keys |
| Test mocking | OK | Consistent `jest.mock('react-i18next')` in all test files |

### 4.2 Possible source of terminal warnings

The i18n configuration itself is correct. Terminal noise may come from:

1. **`Localization.getLocales()` behavior** — In certain environments (web, test, or specific device locales), this may return unexpected values. The fallback to `'pt-BR'` handles this correctly, but the call itself may log a warning.

2. **Missing SplashScreen guard** — Without `SplashScreen.preventAutoHideAsync()`, the app may render before i18n initialization completes, causing a brief flash where translation keys are not yet available.

3. **Side-effect import timing** — `import '../i18n'` runs during module loading. If other modules depend on `i18n` being ready before this import completes, there could be a race condition.

### 4.3 Recommended action

Add `SplashScreen.preventAutoHideAsync()` to the root layout (see Section 3.4 Option B). This prevents premature rendering and eliminates race conditions between i18n init and first paint. Run `expo start --clear` to verify warnings are resolved.

---

## 5. Documentation Version Mismatch

The documentation contains version references that **do not match the installed packages**. This is the most impactful documentation issue because agents reading these files will make incorrect assumptions.

### 5.1 Inaccuracies

| File | Line | Claimed | Actual (package.json) |
|------|------|---------|----------------------|
| `docs/ROADMAP.md` | 9 | Expo SDK 57 | Expo SDK 52 (`~52.0.49`) |
| `docs/ROADMAP.md` | 10 | React Native 0.86 | React Native 0.76.9 |
| `docs/ROADMAP.md` | 11 | TypeScript 6 | TypeScript 5.3.3 (`~5.3.3`) |
| `docs/ROADMAP.md` | 17 | Reanimated 4 | Reanimated 3.16.1 (`~3.16.1`) |
| `.specs/STATE.md` | 11 | Expo SDK 57 | Expo SDK 52 |
| `.specs/STATE.md` | 13 | MMKV 4 | MMKV 3.1.0 (`~3.1.0`) |
| `.specs/STATE.md` | 20 | Reanimated 4 | Reanimated 3.16.1 |
| `.specs/STATE.md` | 21 | gesture-handler 2.32+ | gesture-handler 2.20.2 (`~2.20.2`) |

### 5.2 Impact

Any agent that reads `ROADMAP.md` or `STATE.md` to understand the project stack will get incorrect version information. This could lead to:
- Using APIs that don't exist in the installed versions
- Recommending package upgrades that are already satisfied
- Incorrect compatibility assumptions

### 5.3 Fix

Update all version references in `docs/ROADMAP.md` (lines 9-11, 17) and `.specs/STATE.md` (lines 11, 13, 20-21) to match the actual versions in `package.json`.

---

## 6. Security Findings

### 6.1 npm audit Vulnerabilities

**S1 — `@xmldom/xmldom` <=0.8.12 (HIGH, 5 CVEs)**
- XML injection via unsafe CDATA serialization
- Uncontrolled recursion in XML serialization (DoS)
- Unvalidated DocumentType/processing instruction/comment serialization
- **Type:** Transitive dependency via `@expo/plist` → `@expo/config`
- **Fix:** Run `npm audit fix` (safe, non-breaking)

**S2 — `tar` <=7.5.15 (HIGH, 7 CVEs)**
- Hardlink/symlink path traversal
- Arbitrary file overwrite and symlink poisoning
- Race condition via Unicode ligature collisions
- **Type:** Transitive dependency via `cacache` → `@expo/cli`
- **Fix:** Requires `npm audit fix --force` → installs expo@57 (breaking). **Do not force-fix.** Will resolve when Expo SDK upgrades address this upstream.

**S3 — `uuid` <11.1.1 (MODERATE)**
- Missing buffer bounds check in v3/v5/v6
- **Type:** Transitive via `@expo/bunyan`, `xcode`
- **Fix:** Same as S2 — Expo transitive dependency.

**S4 — `postcss` <8.5.10 (MODERATE)**
- XSS via unescaped `</style>` in CSS Stringify output
- **Type:** Transitive via `@expo/metro-config`
- **Fix:** Same as S2 — Expo transitive dependency.

**Action for S1:** Run `npm audit fix` (without `--force`) to safely fix the xmldom vulnerability.
**Action for S2-S4:** Document as known issues. They are build-time only (not runtime). Will resolve with Expo SDK upgrades. **Never run `npm audit fix --force`** per AGENTS.md gotcha.

### 6.2 Code-Level Security

**S5 — `.gitignore` missing plain `.env`**
- File: `.gitignore:34` — only `.env*.local` is excluded
- A plain `.env` file (without `.local` suffix) would be committed
- **Fix:** Add `.env` to `.gitignore`

**S6 — MMKV without encryption**
- File: `lib/storage.ts:3` — `new MMKV({ id: 'cartflow-storage' })`
- MMKV does not encrypt data at rest by default
- **Assessment:** Acceptable. Stored data (cart lists, product catalogs) is non-sensitive. Revisit if auth tokens or personal data are added.

### 6.3 Clean Items

- No hardcoded secrets, API keys, or tokens anywhere
- No `.env` files committed to repo
- No `console.log` / `console.warn` / `console.error` in source code
- No sensitive file types (`.pem`, `.key`, `.p12`) tracked
- `ios/` and `android/` directories properly gitignored

---

## 7. Code Quality Findings

### 7.1 Medium Priority

**Q1 — Duplicate `Cart` type definition**
- `types/index.ts:15-21` defines `Cart` with `items: CartItem[]`
- `stores/useCartStore.ts:5-10` defines a local `Cart` **without** `items`
- These are structurally different interfaces for the same concept
- **Impact:** When cart items are added in Fase 3, the store's local `Cart` will diverge further from the canonical type, causing confusion and potential type errors
- **Fix:** Remove the local `Cart` interface in `useCartStore.ts` and import from `types/index.ts`. For now, the store's Cart can extend the shared type without `items` using `Omit<Cart, 'items'>`.

**Q2 — No Zustand persist `version`/`migrate` configuration**
- `stores/useCartStore.ts:46-49` — persist config has no `version` or `migrate`
- `stores/useProductStore.ts:130-133` — same
- Zustand persist defaults to version 0. If the `Cart` or `Product` interface changes shape, persisted data will silently fail to hydrate or throw at runtime.
- **Fix:** Add `version: 1` (or appropriate version) to both persist configs. Add `migrate` function for future schema changes.

### 7.2 Low Priority

**Q3 — `Date.now()` ID generation**
- `stores/useCartStore.ts:30` — `` id: `cart_${Date.now()}` ``
- `stores/useProductStore.ts:104` — `` id: `product_${Date.now()}` ``
- Two items created in the same millisecond will have identical IDs
- **Fix:** Use `crypto.randomUUID()` or a UUID library for collision-safe IDs

**Q4 — Hardcoded style values bypass design tokens**
- `app/(tabs)/lists.tsx:27` — `fontSize: 24` (should use `fontSize.h1` which is 32, or define a new token)
- `app/(tabs)/lists.tsx:28` — `fontWeight: 'bold'` (should use `fontWeight.bold`)
- `app/(tabs)/lists.tsx:31` — `fontSize: 16` (should use `fontSize.body`)
- `app/(tabs)/profile.tsx:27,28,31` — same hardcoded values
- **Fix:** Import and use design tokens from `constants/layout.ts`

**Q5 — Inconsistent top padding across screens**
- `lists.tsx:12` and `profile.tsx:12` — `paddingTop: insets.top` (no extra spacing)
- `index.tsx:12` and `products.tsx:118` — `paddingTop: insets.top + spacing.lg`
- **Impact:** Visual inconsistency — placeholder screens have less top spacing than functional screens
- **Fix:** Standardize to `insets.top + spacing.lg` across all tab screens

**Q6 — No tests for `useCartStore`**
- `stores/useCartStore.ts` has zero test coverage
- `stores/useProductStore.ts` has 12 comprehensive tests
- **Fix:** Add unit tests for `addCart`, `removeCart`, `setActiveCart` actions

**Q7 — Empty scaffold directories**
- `components/features/`, `components/ui/`, `hooks/`, `services/`, `utils/`, `__tests__/` (root) — all empty
- These were created during setup but are unused
- **Impact:** Minor. Can be removed to reduce confusion, or kept if the next phase will populate them

---

## 8. Accessibility Findings

### 8.1 Medium Priority

**A1 — Missing `accessibilityRole='button'` on Pressable elements**
- `app/(tabs)/products.tsx:106` — FAB (empty state) — has `accessibilityLabel` but no `accessibilityRole`
- `app/(tabs)/products.tsx:144` — FAB (with products) — same
- `app/product-form.tsx:135` — Cancel button — has `accessibilityLabel` but no `accessibilityRole`
- `app/product-form.tsx:142` — Save button — same
- Only `app/(tabs)/index.tsx:17` correctly sets `accessibilityRole='button'`
- **Fix:** Add `accessibilityRole='button'` to all four Pressable elements

**A2 — Incorrect `accessibilityLabel` on name TextInput**
- `app/product-form.tsx:104` — `accessibilityLabel={t('products.newProduct')}` translates to "Novo Produto"
- This is the same label as the FAB button, making it impossible for screen readers to distinguish between the button and the input field
- **Fix:** Change to `accessibilityLabel={t('products.nameLabel')}` or a more specific field label

**A3 — Missing `accessibilityLabel` on TextInputs**
- `app/product-form.tsx:111` — Category TextInput has no `accessibilityLabel`
- `app/product-form.tsx:123` — Price TextInput has no `accessibilityLabel`
- `app/(tabs)/products.tsx:122` — Search TextInput has no `accessibilityLabel`
- **Fix:** Add `accessibilityLabel` using corresponding label translation keys

### 8.2 Low Priority

**A4 — List items missing accessibility semantics**
- `app/(tabs)/products.tsx:34-41` — `ProductListItem` renders product cards as `View` with `Text` children
- No `accessibilityLabel` or `accessibilityRole` on the card container
- **Fix:** Add `accessibilityRole="summary"` or `accessibilityLabel` with product name to the card `View`

**A5 — Missing `hitSlop` on small touch targets**
- `app/product-form.tsx:135-138` — Cancel button has minimal padding (`spacing.sm` = 8px vertical, `spacing.md` = 16px horizontal), effective touch target likely under 44pt minimum
- **Fix:** Add `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` to small Pressables

---

## 9. React Native Best Practices

### 9.1 Passed

| Practice | Status | Evidence |
|----------|--------|----------|
| Pressable (not TouchableOpacity) | PASS | All interactive elements use `Pressable` |
| LegendList for virtualized lists | PASS | `products.tsx:136` — `LegendList` with `estimatedItemSize`, `keyExtractor` |
| StyleSheet.create | PASS | All screens use `StyleSheet.create()` for primary styles |
| Platform.select for shadows | PASS | `products.tsx:230-240` — iOS shadow vs Android elevation |
| SafeAreaProvider + useSafeAreaInsets | PASS | Root layout wraps in `SafeAreaProvider`, screens use `useSafeAreaInsets()` |
| React.memo + useMemo optimization | PASS | `ProductListItem` memoized, data transforms memoized |
| TypeScript strict mode | PASS | `tsconfig.json` has `"strict": true` |
| Expo typed routes | PASS | `app.json` has `"typedRoutes": true` |
| Expo Router file-based routing | PASS | Proper `_layout.tsx` files for all route groups |
| i18n throughout | PASS | All user-facing strings use `t()` calls |
| No ScrollView for dynamic lists | PASS | LegendList used, no `.map()` on ScrollView |

### 9.2 Needs Attention

| Practice | Status | Details |
|----------|--------|---------|
| SplashScreen guard | MISSING | No `preventAutoHideAsync()` / `hideAsync()` calls |
| Font loading | MISSING | `expo-font` configured but never used (see Section 3) |
| `KeyboardAvoidingView` behavior on Android | MINOR | Set to `undefined` — some codebases prefer `'height'` for Android |

---

## 10. Prioritized Fix List

### P0 — Fix Before Merge

These issues affect build reliability and will compound if not addressed.

| ID | Finding | File(s) | Action |
|----|---------|---------|--------|
| EXP | expo-font/splash screen misconfigured | `app.json:35`, `app/_layout.tsx` | Either remove unused `expo-font` plugin or properly set up `useFonts` + `SplashScreen` guard (see Section 3.4) |
| Q1 | Duplicate `Cart` type definition | `types/index.ts:15`, `stores/useCartStore.ts:5` | Remove local `Cart` interface in store, import from `types/index.ts` using `Omit<Cart, 'items'>` |
| DOC | Documentation version mismatch | `docs/ROADMAP.md:9-17`, `.specs/STATE.md:11-21` | Correct all version references to match installed packages |

### P1 — Fix Before Next Phase

These issues affect accessibility compliance, security hygiene, and data integrity.

| ID | Finding | File(s) | Action |
|----|---------|---------|--------|
| A1 | Missing `accessibilityRole='button'` | `products.tsx:106,144`, `product-form.tsx:135,142` | Add `accessibilityRole='button'` to all Pressable buttons |
| A2 | Incorrect `accessibilityLabel` on name input | `product-form.tsx:104` | Change to field-specific label |
| A3 | Missing `accessibilityLabel` on 3 TextInputs | `product-form.tsx:111,123`, `products.tsx:122` | Add `accessibilityLabel` to each |
| S1 | npm audit: xmldom CVEs | transitive | Run `npm audit fix` (safe, non-breaking) |
| S5 | `.gitignore` missing `.env` | `.gitignore:34` | Add `.env` to gitignore |
| Q2 | No persist version/migrate | `stores/useCartStore.ts:46`, `stores/useProductStore.ts:130` | Add `version` and `migrate` to persist configs |

### P2 — Tech Debt Backlog

Fix when touching the relevant files or during the next phase.

| ID | Finding | File(s) | Action |
|----|---------|---------|--------|
| Q3 | `Date.now()` ID generation | `stores/useCartStore.ts:30`, `stores/useProductStore.ts:104` | Replace with `crypto.randomUUID()` |
| Q4 | Hardcoded style values | `lists.tsx:27-31`, `profile.tsx:27-31` | Import and use design tokens from `constants/layout.ts` |
| Q5 | Inconsistent top padding | `lists.tsx:12`, `profile.tsx:12` | Standardize to `insets.top + spacing.lg` |
| Q6 | No `useCartStore` tests | `stores/useCartStore.ts` | Add unit tests for CRUD actions |
| Q7 | Empty scaffold directories | Multiple | Remove or populate as needed |
| A4 | List items missing a11y | `products.tsx:34-41` | Add `accessibilityRole`/`accessibilityLabel` to product cards |
| A5 | Missing `hitSlop` | `product-form.tsx:135-138` | Add `hitSlop` to small touch targets |

---

## Appendix: File Reference

| File | Lines | Key Findings |
|------|-------|-------------|
| `app/_layout.tsx` | 23 | No SplashScreen guard, no font loading |
| `app/(tabs)/_layout.tsx` | 41 | OK — tabs with i18n |
| `app/(tabs)/index.tsx` | ~50 | OK — has `accessibilityRole='button'` |
| `app/(tabs)/products.tsx` | 242 | Missing `accessibilityRole` on FABs, hardcoded FAB dimensions, no a11y on search input |
| `app/(tabs)/lists.tsx` | 35 | Hardcoded styles, inconsistent padding |
| `app/(tabs)/profile.tsx` | 35 | Hardcoded styles, inconsistent padding |
| `app/product-form.tsx` | 224 | Wrong a11y label on name input, missing a11y on other inputs, missing role on buttons |
| `stores/useCartStore.ts` | 51 | Duplicate Cart type, no persist version, Date.now() IDs |
| `stores/useProductStore.ts` | 135 | No persist version, Date.now() IDs |
| `types/index.ts` | 21 | Canonical Cart type (with items) |
| `lib/storage.ts` | 9 | Clean MMKV adapter |
| `i18n/index.ts` | 18 | Clean i18n config |
| `i18n/locales/pt-BR.json` | 66 | All keys present |
| `constants/colors.ts` | 13 | Clean design tokens |
| `constants/layout.ts` | 37 | Clean design tokens |
| `app.json` | 41 | Missing splash config, unused expo-font plugin |
| `.gitignore` | 51 | Missing `.env` exclusion |
| `docs/ROADMAP.md` | 172 | Wrong SDK/RN/Reanimated versions |
| `.specs/STATE.md` | 35 | Wrong SDK/MMKV/Reanimated/GH versions |
