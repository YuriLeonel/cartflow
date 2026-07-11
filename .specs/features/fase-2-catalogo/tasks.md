# Fase 2 — Catálogo de Produtos Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user — do not proceed without it.**

---

**Design**: `.specs/features/fase-2-catalogo/design.md`
**Status**: Draft

---

## Test Coverage Matrix

> Generated from codebase (5 test files exist under `app/(tabs)/__tests__/`), project guidelines (`AGENTS.md` mandates Jest + security), and spec ACs. Confirm before Execute.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Store (useProductStore) | unit | All branches; 1:1 to spec ACs (add, search, seed); edge cases (empty query, no results, duplicate seed) | `stores/useProductStore.test.ts` | `npm run test` |
| Screen (Products) | unit | Render list with categories, search filters, empty state (PROD-01, PROD-04, PROD-05) | `app/(tabs)/products.test.tsx` | `npm run test` |
| Screen (ProductForm) | unit | Render form, validation errors, submit success (PROD-07, PROD-08, PROD-09, PROD-E01, PROD-E02, PROD-E03) | `app/product/new.test.tsx` | `npm run test` |
| Seed data | none | — (build gate only / tested via store tests) | — | build gate only |
| i18n keys | none | — (build gate only) | — | build gate only |

## Parallelism Assessment

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
| --------- | -------------- | --------------- | -------- |
| unit | Yes | Each test file isolated; no shared mutable state | Jest 29 default + Fase 1 tests run independently |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests | `npm run test` |
| Build | After phase completion or config-only tasks | `npm run lint && npm run typecheck` |
| Full | After final task | `npm run lint && npm run typecheck && npm run test` |

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Preparação de dados e store.

```
T1 → T2
```

### Phase 2: Screens (Parallel OK)

Telas podem ser criadas em paralelo após a store existir.

```
     ┌→ T3 ─┐
T2 ──┤       ├──→ (done when both created)
     └→ T4 ─┘
```

### Phase 3: i18n + Polish (Sequential)

Chaves de tradução e verificação final.

```
T3, T4 done → T5 → T6 (full gate)
```

---

## Task Breakdown

### T1: Criar seed data (`utils/seedProducts.ts`)

**What**: Criar arquivo com array de produtos mockados para inicialização do catálogo. Produtos em categorias realistas (Hortifrúti, Padaria, Bebidas, Limpeza, etc.) com nomes em português.

**Where**: `utils/seedProducts.ts` (create)

**Depends on**: None

**Reuses**: `Product` interface de `types/index.ts`

**Done when**:

- [ ] Arquivo exporta `seedProducts: Product[]` com pelo menos 15 produtos
- [ ] Produtos distribúidos em 4+ categorias
- [ ] Cada produto tem `id`, `name`, `category`, e opcionalmente `expectedPrice`
- [ ] `npm run lint && npm run typecheck` passa

**Tests**: none (testado via store tests em T2)
**Gate**: build

**Requirement**: PROD-11, PROD-12

**Commit**: `feat(products): add seed data for initial catalog`

---

### T2: Criar ProductStore (`stores/useProductStore.ts`)

**What**: Criar store Zustand + MMKV para CRUD de produtos. Incluir:
- `products: Product[]` — estado
- `addProduct(data)` — adicionar com ID auto-gerado
- `searchProducts(query)` — filtro case-insensitive por nome
- `initializeWithSeed()` — carregar seed se store vazia (usa flag `_seeded` em memória)

**Where**: `stores/useProductStore.ts` (create)

**Depends on**: T1 (seed data)

**Reuses**: Padrão MMKV + persist do `useCartStore.ts`, `Product` type

**Done when**:

- [ ] Store persiste produtos no MMKV
- [ ] `addProduct` gera ID e adiciona ao array
- [ ] `searchProducts` filtra case-insensitive por nome
- [ ] `initializeWithSeed` só carrega seed na primeira execução
- [ ] Testes unitários: add, search (com resultados e sem), seed init, não-duplicação
- [ ] `npm run test` passa (test count: 5+)
- [ ] `npm run lint && npm run typecheck` passa

**Tests**: unit
**Gate**: quick

**Requirement**: PROD-01, PROD-04, PROD-05, PROD-06, PROD-11, PROD-12

**Commit**: `feat(products): create ProductStore with Zustand + MMKV persistence`

---

### T3: Criar Products Screen (`app/(tabs)/products.tsx`) [P]

**What**: Substituir placeholder da aba Produtos por tela com:
- Campo de busca textual no topo
- Lista de produtos agrupados por categoria usando `React.useMemo` para agrupar
- Renderização com `LegendList` do `@legendapp/list` para performance
- Estados: lista cheia, busca vazia ("Nenhum produto encontrado"), lista vazia sem seed
- Botão "Novo Produto" que navega para `app/product/new`

**Where**: `app/(tabs)/products.tsx` (modify — replace placeholder content)

**Depends on**: T2 (ProductStore)

**Reuses**: Mesmo padrão de layout das telas existentes (SafeArea, StyleSheet, i18n), `colors`, `spacing` de constants, `useSafeAreaInsets`

**Done when**:

- [ ] Lista renderiza produtos agrupados por categoria
- [ ] Busca filtra em tempo real conforme digitação
- [ ] "Nenhum produto encontrado" aparece quando busca não tem resultados
- [ ] Botão "Novo Produto" navega para `/product/new`
- [ ] `LegendList` é usado para renderização virtualizada
- [ ] Testes unitários: render with products, search filters, empty search state
- [ ] `npm run test` passa
- [ ] `npm run lint && npm run typecheck` passa

**Tests**: unit
**Gate**: quick

**Requirement**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06

**Commit**: `feat(products): implement product list screen with search and categories`

---

### T4: Criar ProductForm (`app/product/new.tsx`) [P]

**What**: Criar tela modal para cadastro manual de produto com:
- Campo "Nome" (obrigatório) — TextInput
- Campo "Categoria" (opcional) — TextInput
- Campo "Preço esperado" (opcional) — TextInput com teclado numérico
- Botão "Salvar" — valida e persiste
- Botão "Cancelar" — volta sem salvar
- Validações: nome vazio/só espaços, preço negativo, nome > 100 chars
- Exibição de erros inline abaixo dos campos

**Where**: `app/product/new.tsx` (create)

**Depends on**: T2 (ProductStore)

**Reuses**: `useSafeAreaInsets`, `colors`, `spacing`, `fontSize`, `borderRadius`, `Pressable`, `useTranslation`

**Done when**:

- [ ] Formulário renderiza com 3 campos + botões Salvar/Cancelar
- [ ] Submit com nome válido salva e redireciona para lista (router.back())
- [ ] Submit sem nome exibe erro "Nome é obrigatório"
- [ ] Submit com preço negativo exibe erro "Preço deve ser positivo"
- [ ] Submit com nome > 100 chars exibe erro "Nome muito longo (máx. 100 caracteres)"
- [ ] Cancelar volta sem salvar
- [ ] Testes unitários: render, submit válido, validações de erro
- [ ] `npm run test` passa
- [ ] `npm run lint && npm run typecheck` passa

**Tests**: unit
**Gate**: quick

**Requirement**: PROD-07, PROD-08, PROD-09, PROD-10, PROD-E01, PROD-E02, PROD-E03

**Commit**: `feat(products): create product registration form`

---

### T5: Adicionar chaves i18n para produtos

**What**: Adicionar namespace `products` ao `i18n/locales/pt-BR.json` com chaves para a tela de produtos e formulário.

**Where**: `i18n/locales/pt-BR.json` (modify)

**Depends on**: None (pode ser feito em paralelo com T1-T4, mas executa antes do gate final)

**Reuses**: Estrutura i18n existente

**Done when**:

- [ ] `products.title: "Produtos"` existe
- [ ] `products.search: "Buscar produtos..."` existe
- [ ] `products.newProduct: "Novo Produto"` existe
- [ ] `products.noResults: "Nenhum produto encontrado"` existe
- [ ] `products.emptyCatalog: "Nenhum produto cadastrado"` existe
- [ ] `products.form.title: "Novo Produto"` existe
- [ ] `products.form.name: "Nome"` existe
- [ ] `products.form.category: "Categoria"` existe
- [ ] `products.form.expectedPrice: "Preço esperado"` existe
- [ ] `products.form.save: "Salvar"` existe
- [ ] `products.form.cancel: "Cancelar"` existe
- [ ] `products.form.error.nameRequired: "Nome é obrigatório"` existe
- [ ] `products.form.error.pricePositive: "Preço deve ser positivo"` existe
- [ ] `products.form.error.nameTooLong: "Nome muito longo (máx. 100 caracteres)"` existe
- [ ] `products.form.error.saveError: "Erro ao salvar produto"` existe
- [ ] Arquivo é JSON válido

**Tests**: none
**Gate**: build

**Requirement**: PROD-01, PROD-04, PROD-05, PROD-07

**Commit**: `feat(i18n): add product catalog translation keys`

---

### T6: Full gate — lint, typecheck, test

**What**: Verificação final de toda a feature.

**Where**: N/A

**Depends on**: T3, T4, T5 (todas completas)

**Reuses**: N/A

**Done when**:

- [ ] `npm run lint` passa sem erros
- [ ] `npm run typecheck` passa sem erros
- [ ] `npm run test` passa com todos os testes existentes + novos
- [ ] Nenhum teste foi silenciosamente deletado ou modificado

**Tests**: N/A
**Gate**: full

**Requirement**: Todos

**Commit**: (N/A — verificação, sem commit)

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 ──→ T2

Phase 2 (Parallel):
  T2 complete, then:
    ├── T3 [P]  (Products Screen)
    └── T4 [P]  (Product Form)
  T5 (i18n — any time before T6)

Phase 3 (Sequential):
  T3, T4, T5 complete, then:
    T6 (full gate)
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Seed data | 1 file create | ✅ Granular |
| T2: ProductStore | 1 file create | ✅ Granular |
| T3: Products Screen | 1 file modify | ✅ Granular |
| T4: ProductForm | 1 file create | ✅ Granular |
| T5: i18n keys | 1 file modify | ✅ Granular |
| T6: Full gate | N/A (verification) | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | No incoming arrows | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T2 | T2 → T4 | ✅ Match |
| T5 | None | No incoming arrows (any time) | ✅ Match |
| T6 | T3, T4, T5 | T3, T4, T5 → T6 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Seed data | none | none | ✅ OK |
| T2 | Store | unit | unit | ✅ OK |
| T3 | Screen | unit | unit | ✅ OK |
| T4 | Screen | unit | unit | ✅ OK |
| T5 | i18n config | none | none | ✅ OK |
| T6 | N/A (verification) | N/A | N/A | ✅ OK |
