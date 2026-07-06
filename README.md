# Cartflow

Smart shopping list mobile app. Create carts, track product prices, compare expected vs current prices, and view purchase history.

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 57 (managed) |
| Platform | React Native 0.86 (Android + iOS) |
| Language | TypeScript 6 (strict) |
| Routing | Expo Router 4 (file-based) |
| State | Zustand 5 + MMKV 4 |
| i18n | i18next + expo-localization |
| Lists | @legendapp/list |
| Images | expo-image |
| Animations | react-native-reanimated 4 |
| Gestures | react-native-gesture-handler |
| Testing | Jest + @testing-library/react-native |
| Lint / Format | Biome |

## Prerequisites

- Node.js 22.13+
- npm or yarn
- Expo CLI (`npx expo`)
- Android Studio (Android builds) or Xcode (iOS builds, macOS only)

## Setup

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android emulator / `i` for iOS simulator.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run android` | Launch on Android emulator |
| `npm run ios` | Launch on iOS simulator |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run test` | Run Jest tests |

## Project structure

```
src/
├── app/                    # Routes (Expo Router)
│   ├── _layout.tsx         # Root layout (providers)
│   └── index.tsx           # Home screen
├── components/
│   ├── ui/                 # Atomic components (Button, Card, Input)
│   └── features/           # Feature-specific components
├── hooks/                  # Custom hooks
├── services/               # API client, external services
├── stores/                 # Zustand stores
├── constants/              # Colors, spacing
├── types/                  # TypeScript types
├── utils/                  # Utility functions
├── i18n/                   # Translations (pt-BR)
│   ├── index.ts
│   └── locales/
│       └── pt-BR.json
├── __tests__/              # Unit tests
├── assets/                 # Images, fonts
├── docs/
│   └── superpowers/
│       └── specs/          # TLC specs
├── .specs/                 # TLC project memory
├── app.json
├── tsconfig.json
├── biome.json
└── jest.config.js
```

## Development workflow

This project follows the **TLC Spec-Driven** flow:

1. **Specify** — define feature requirements
2. **Design** — architecture and components
3. **Tasks** — break down into atomic tasks
4. **Implement** — implement with atomic commits
5. **Validate** — verify against acceptance criteria

See `AGENTS.md` for conventions and workflows.

## Roadmap

See `docs/ROADMAP.md` for the full MVP roadmap and phase dependencies.

## License

Not set.
