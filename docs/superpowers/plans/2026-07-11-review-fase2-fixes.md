# Review Fase 2 Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix P0 and P1 issues from `feature/fase-2-catalogo` code review: expo-font misconfiguration, duplicate Cart type, documentation version drift, accessibility gaps, gitignore gap, and persist versioning.

**Architecture:** Each task is a standalone fix that touches 1-3 files. No interdependencies between tasks — they can be executed in any order. All fixes preserve existing behavior.

**Tech Stack:** React Native (Expo SDK 52), TypeScript, Zustand, expo-font, expo-splash-screen

---

## Task 1: Remove unused expo-font plugin and add SplashScreen guard

**Files:**
- Modify: `app.json:27-36` — remove `expo-font` plugin
- Modify: `package.json:10` — remove `expo-font` dependency
- Modify: `app/_layout.tsx:1-23` — add SplashScreen guard

- [ ] **Step 1: Remove expo-font plugin from app.json**

```json
// app.json — replace plugins array (lines 27-36)
"plugins": [
  [
    "expo-router",
    {
      "origin": "https://cartflow.app"
    }
  ],
  "expo-asset"
],
```

- [ ] **Step 2: Remove expo-font from package.json**

Remove `"expo-font": "~13.0.4",` from `dependencies` (line 10).

- [ ] **Step 3: Add SplashScreen guard to root layout**

```tsx
// app/_layout.tsx — full file
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen
            name='product-form'
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 4: Run npm install to sync lockfile**

Run: `npm install`
Expected: lockfile updated, expo-font removed

- [ ] **Step 5: Verify lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: 0 issues

---

## Task 2: Fix duplicate Cart type

**Files:**
- Modify: `types/index.ts:15-21` — add `CartSummary` type (without items)
- Modify: `stores/useCartStore.ts:1-10` — import `CartSummary` from types, remove local interface

- [ ] **Step 1: Add CartSummary type to types/index.ts**

```typescript
// types/index.ts — add after Cart interface (line 21)
export type CartSummary = Omit<Cart, 'items'>;
```

- [ ] **Step 2: Update useCartStore to use CartSummary**

```typescript
// stores/useCartStore.ts — lines 1-10
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from '../lib/storage';
import type { CartSummary } from '../types';

interface CartStore {
  carts: CartSummary[];
  activeCartId: string | null;
  addCart: (name: string) => void;
  removeCart: (id: string) => void;
  setActiveCart: (id: string | null) => void;
}
```

Also update line 29 to use `CartSummary`:
```typescript
const newCart: CartSummary = {
```

- [ ] **Step 3: Verify lint, typecheck, and tests**

Run: `npm run lint && npm run typecheck && npm run test`
Expected: all pass

---

## Task 3: Fix documentation version mismatches

**Files:**
- Modify: `docs/ROADMAP.md:9-17` — correct version numbers
- Modify: `.specs/STATE.md:11,13,20-21` — correct version numbers

- [ ] **Step 1: Update ROADMAP.md stack table**

```markdown
# docs/ROADMAP.md — replace lines 7-21
## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 52 (managed) |
| Platform | React Native 0.76 (Android + iOS) |
| Language | TypeScript 5.3 (strict) |
| Routing | Expo Router 4 (file-based) |
| State | Zustand 5 + MMKV 3 (persist middleware) |
| i18n | i18next + react-i18next + expo-localization (pt-BR) |
| Lists | @legendapp/list |
| Images | expo-image |
| Animations | react-native-reanimated 3 + worklets |
| Gestures | react-native-gesture-handler |
| Testing | Jest + @testing-library/react-native |
| Lint / Format | Biome |
| Storage | MMKV (primary key-value) |
```

- [ ] **Step 2: Update STATE.md active decisions**

```markdown
# .specs/STATE.md — replace lines 11,13,20-21
| AD-001 | Expo SDK | 52 (managed) |
| AD-004 | State | Zustand 5 + MMKV 3 persist |
| AD-010 | Animations | react-native-reanimated 3 |
| AD-011 | Gestures | react-native-gesture-handler 2.20 |
```

- [ ] **Step 3: Verify no remaining version drift**

Run: `grep -n "SDK 57\|RN 0.86\|TypeScript 6\|MMKV 4\|reanimated 4\|2.32+" docs/ROADMAP.md .specs/STATE.md`
Expected: no matches

---

## Task 4: Add accessibilityRole and fix accessibilityLabels

**Files:**
- Modify: `app/(tabs)/products.tsx:106-112,144-150` — add `accessibilityRole='button'` to FABs
- Modify: `app/(tabs)/products.tsx:122` — add `accessibilityLabel` to search input
- Modify: `app/(tabs)/products.tsx:34-41` — add accessibility to product cards
- Modify: `app/product-form.tsx:104` — fix incorrect accessibilityLabel
- Modify: `app/product-form.tsx:111,123` — add accessibilityLabel to inputs
- Modify: `app/product-form.tsx:135,142` — add `accessibilityRole='button'` to buttons

- [ ] **Step 1: Fix products.tsx — FABs and search input**

Add `accessibilityRole='button'` to both FAB Pressables (lines 106 and 144):
```tsx
<Pressable
  style={[styles.fab, { bottom: insets.bottom + spacing.md }]}
  onPress={() => router.push('/product-form')}
  accessibilityLabel={t('products.newProduct')}
  accessibilityRole='button'
>
```

Add `accessibilityLabel` to search TextInput (line 122):
```tsx
<TextInput
  style={styles.searchInput}
  placeholder={t('products.search')}
  placeholderTextColor={colors.textSecondary}
  value={searchQuery}
  onChangeText={setSearchQuery}
  autoCorrect={false}
  accessibilityLabel={t('products.search')}
/>
```

- [ ] **Step 2: Fix products.tsx — product card accessibility**

```tsx
// products.tsx ProductListItem — lines 34-41
return (
  <View
    style={styles.productCard}
    accessibilityRole='summary'
    accessibilityLabel={`${item.name}${item.expectedPrice !== undefined ? `, ${formatPrice(item.expectedPrice)}` : ''}`}
  >
    <Text style={styles.productName}>{item.name}</Text>
    {item.expectedPrice !== undefined && (
      <Text style={styles.productPrice}>{formatPrice(item.expectedPrice)}</Text>
    )}
  </View>
);
```

- [ ] **Step 3: Fix product-form.tsx — name input label**

```tsx
// product-form.tsx line 104
accessibilityLabel={t('products.nameLabel')}
```

- [ ] **Step 4: Fix product-form.tsx — category and price inputs**

```tsx
// product-form.tsx line 111 — category input
accessibilityLabel={t('products.category')}

// product-form.tsx line 123 — price input
accessibilityLabel={t('products.expectedPrice')}
```

- [ ] **Step 5: Fix product-form.tsx — buttons**

```tsx
// product-form.tsx line 135 — cancel button
accessibilityLabel={t('common.cancel')}
accessibilityRole='button'

// product-form.tsx line 142 — save button
accessibilityLabel={t('common.save')}
accessibilityRole='button'
```

- [ ] **Step 6: Verify lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: 0 issues

---

## Task 5: Add .env to .gitignore

**Files:**
- Modify: `.gitignore:34` — add `.env` pattern

- [ ] **Step 1: Add .env to gitignore**

```gitignore
# .gitignore — replace line 34
.env
.env*.local
```

- [ ] **Step 2: Verify .env is excluded**

Run: `git check-ignore .env`
Expected: `.env` (matched)

---

## Task 6: Add persist version and migrate to Zustand stores

**Files:**
- Modify: `stores/useCartStore.ts:46-49` — add `version` and `migrate`
- Modify: `stores/useProductStore.ts:130-133` — add `version` and `migrate`

- [ ] **Step 1: Add version to useCartStore persist config**

```typescript
// stores/useCartStore.ts — lines 46-49
{
  name: 'cartflow-carts',
  storage: createJSONStorage(() => zustandMMKVStorage),
  version: 1,
  migrate: (persistedState: unknown, version: number) => {
    if (version === 0) {
      return persistedState;
    }
    return persistedState;
  },
},
```

- [ ] **Step 2: Add version to useProductStore persist config**

```typescript
// stores/useProductStore.ts — lines 130-133
{
  name: 'cartflow-products',
  storage: createJSONStorage(() => zustandMMKVStorage),
  version: 1,
  migrate: (persistedState: unknown, version: number) => {
    if (version === 0) {
      return persistedState;
    }
    return persistedState;
  },
},
```

- [ ] **Step 3: Verify lint, typecheck, and tests**

Run: `npm run lint && npm run typecheck && npm run test`
Expected: all pass

---

## Task 7: Fix inconsistent padding and hardcoded styles

**Files:**
- Modify: `app/(tabs)/lists.tsx:12,27-31` — use design tokens and fix padding
- Modify: `app/(tabs)/profile.tsx:12,27-31` — same

- [ ] **Step 1: Fix lists.tsx — use design tokens and consistent padding**

```tsx
// lists.tsx — full file
import { colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('tabs.lists')}</Text>
      <Text style={styles.message}>{t('tabs.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
```

- [ ] **Step 2: Fix profile.tsx — same changes**

```tsx
// profile.tsx — full file
import { colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Text style={styles.title}>{t('tabs.profile')}</Text>
      <Text style={styles.message}>{t('tabs.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
  },
  message: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
```

- [ ] **Step 3: Verify lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: 0 issues

---

## Task 8: Run npm audit fix (safe, non-breaking)

**Files:** None (transitive dependency fix)

- [ ] **Step 1: Run npm audit fix (without --force)**

Run: `npm audit fix`
Expected: xmldom CVEs fixed, no breaking changes

- [ ] **Step 2: Verify audit improved**

Run: `npm audit`
Expected: reduced vulnerability count (no high-severity xmldom issues)

---

## Task 9: Final verification

- [ ] **Step 1: Run all verification commands**

Run: `npm run lint && npm run typecheck && npm run test`
Expected: all pass with 0 issues

- [ ] **Step 2: Verify no regressions**

Run: `npm audit`
Expected: no new high-severity issues introduced
