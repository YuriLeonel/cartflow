# Cartflow — Project State

## Handoff

Project setup complete. Ready for feature development.

### Active Decisions

| ID | Decision | Value |
|---|---|---|
| AD-001 | Expo SDK | 57 (managed) |
| AD-002 | Router | Expo Router 4 (file-based) |
| AD-003 | Language | TypeScript strict |
| AD-004 | State | Zustand 5 + MMKV persist |
| AD-005 | i18n | i18next + react-i18next + expo-localization |
| AD-006 | Tests | Jest + @testing-library/react-native |
| AD-007 | Lint/Format | Biome |
| AD-008 | Lists | @legendapp/list |
| AD-009 | Images | expo-image |
| AD-010 | Animations | react-native-reanimated 4 |
| AD-011 | Gestures | react-native-gesture-handler 2.32+ |
| AD-012 | Storage | MMKV (primary) |
| AD-013 | Platforms | Android + iOS |

### In-Progress Features

None.

### Completed Features

- **Fase 1 — Estrutura de Navegação e Contexto** (branch `feature/fase-1-navegacao`) — ✅ Ready to merge into develop. 4 tabs (Início, Listas, Produtos, Perfil) with i18n, emoji icons, Home screen with actions, placeholder screens, 7 unit tests passing.

### Next

Follow `docs/ROADMAP.md` phases in order. Start with Fase 2 — Catálogo de Produtos.
