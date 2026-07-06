# Cartflow Project Setup Design

**Date:** 2026-07-06
**Status:** Approved
**Goal:** Scaffold and configure the Cartflow React Native (Expo) project for feature development.

## Stack Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Expo SDK 57 (managed) | Most productive for RN dev; OTA updates; build service |
| Router | Expo Router 4 (file-based, native-stack) | Standard Expo ecosystem |
| Language | TypeScript strict | Type safety |
| State | Zustand 5 + MMKV persist | Single store with fast KV persistence; ideal for cart |
| i18n | i18next + react-i18next + expo-localization | Mature ecosystem; namespace support |
| Tests | Jest + @testing-library/react-native | Standard Expo; jest-expo preset |
| Lint/Format | Biome | Unified; fast |
| Lists | @legendapp/list | Performance over FlatList |
| Images | expo-image | Smart cache; blurhash; list perf |
| Animations | react-native-reanimated 4 | GPU-accelerated |
| Gestures | react-native-gesture-handler 2.32+ | Required by navigation |
| Storage | MMKV (primary), expo-sqlite (future) | KV for persist; SQLite for complex queries |
| Platforms | Android + iOS | Full cross-platform |

## Directory Structure

```
cartflow/
├── app/                    # Expo Router (file-based routes)
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Home screen
├── components/
│   ├── ui/                 # Atoms (Button, Card, Input)
│   └── features/           # Feature-specific components
├── hooks/                  # Custom hooks
├── services/               # API client, external services
├── stores/                 # Zustand stores
├── constants/              # colors.ts, layout.ts
├── types/                  # TypeScript type definitions
├── utils/                  # Pure utility functions
├── i18n/                   # Translation files (pt-BR only)
├── __tests__/              # Jest unit tests
├── assets/                 # Images, fonts
├── docs/superpowers/specs/ # TLC specs
├── .specs/                 # TLC project memory
├── app.json
├── tsconfig.json
├── jest.config.js
├── biome.json
└── AGENTS.md
```

## Acceptance Criteria

- [x] `npx expo start` opens without errors
- [x] Expo Router routing functional (home screen renders)
- [x] Zustand store functional with MMKV persistence
- [x] i18n pt-BR locale working
- [x] `npm run lint` passes without errors
- [x] `npm run test` runs without errors
- [x] `tsc --noEmit` without type errors
- [x] AGENTS.md reflects session decisions
