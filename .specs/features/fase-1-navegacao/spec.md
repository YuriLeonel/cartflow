# Fase 1 — Estrutura de Navegação e Contexto Specification

## Problem Statement

O app Cartflow não possui estrutura de navegação definida. Atualmente existe apenas uma tela Home solta. O usuário precisa de um sistema de abas para acessar as principais seções do app: Home, Listas, Produtos e Perfil. Sem essa estrutura, não é possível avançar para as próximas fases do roadmap.

## Goals

- [ ] Estabelecer navegação por abas (Bottom Tabs) com 4 seções
- [ ] Cada tela exibe seu título em pt-BR
- [ ] Layout responsivo funcionando em Android e iOS
- [ ] Base para as próximas fases do roadmap

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Ícones customizados ou animados | Usar texto/ícones simples do Expo inicialmente |
| Personalização de abas (cor, ordem) | Será definido em fase futura se necessário |
| Autenticação ou perfil funcional | Perfil é placeholder até fases futuras |
| Listas ou produtos funcionais | Placeholders até Fase 2 e Fase 3 |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Tipo de Tab Navigator | `expo-router` com `(tabs)` group + `TabList`/`TabTrigger` | Expo Router 4 nativo, sem dependências extras | n |
| Ícones nas abas | Texto simples (emoji ou caracteres) como fallback inicial | Evita dependência de biblioteca de ícones no MVP | n |
| Título das abas | pt-BR via i18n | Consistente com política de i18n do projeto | n |

**Open questions:** resolved or logged above.

---

## User Stories

### P1: Navegação por Abas ⭐ MVP

**User Story**: Como usuário, quero navegar entre as seções do app usando abas na parte inferior para acessar rapidamente Home, Listas, Produtos e Perfil.

**Why P1**: Estrutura base do app — sem abas não há navegação entre telas.

**Acceptance Criteria**:

1. NAV-01: WHEN usuário abre o app THEN sistema SHALL exibir 4 abas na parte inferior: Início, Listas, Produtos, Perfil
2. NAV-02: WHEN usuário toca em uma aba THEN sistema SHALL exibir a tela correspondente
3. NAV-03: WHEN usuário está em uma tela THEN sistema SHALL destacar visualmente a aba ativa
4. NAV-04: WHEN usuário alterna entre abas THEN sistema SHALL manter o estado da tela anterior

**Independent Test**: Abrir app → ver 4 abas → tocar em cada aba → confirmar que a tela correta aparece.

---

### P1: Tela Home com Resumo ⭐ MVP

**User Story**: Como usuário, quero ver uma tela inicial com resumo e acesso rápido às principais ações.

**Why P1**: É a primeira tela que o usuário vê — precisa ser informativa.

**Acceptance Criteria**:

1. NAV-05: WHEN usuário está na Home THEN sistema SHALL exibir o título "Cartflow" e subtítulo "Sua lista de compras inteligente"
2. NAV-06: WHEN usuário está na Home THEN sistema SHALL exibir botão "Nova Lista" e seção "Minhas Listas"

**Independent Test**: Navegar para Home → ver título, subtítulo e atalhos.

---

### P1: Telas Placeholder ⭐ MVP

**User Story**: Como usuário, quero ver telas placeholder para Listas, Produtos e Perfil para entender a estrutura do app.

**Why P1**: Necessário para que a navegação funcione com todas as abas.

**Acceptance Criteria**:

1. NAV-07: WHEN usuário acessa a aba Listas THEN sistema SHALL exibir título "Listas" e mensagem "Em breve"
2. NAV-08: WHEN usuário acessa a aba Produtos THEN sistema SHALL exibir título "Produtos" e mensagem "Em breve"
3. NAV-09: WHEN usuário acessa a aba Perfil THEN sistema SHALL exibir título "Perfil" e mensagem "Em breve"

**Independent Test**: Tocar em cada aba placeholder → ver título e mensagem.

---

## Edge Cases

- NAV-E01: WHEN dispositivo tem notch ou Dynamic Island THEN sistema SHALL respeitar a área segura (safe area)
- NAV-E02: WHEN usuário rotaciona o dispositivo THEN sistema SHALL manter a navegação funcional
- NAV-E03: WHEN app é aberto pela primeira vez THEN sistema SHALL exibir a aba Home como padrão

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| NAV-01 | P1: Navegação por Abas | Design | ✅ Verified |
| NAV-02 | P1: Navegação por Abas | Design | ✅ Verified by design |
| NAV-03 | P1: Navegação por Abas | Design | ✅ Verified by design |
| NAV-04 | P1: Navegação por Abas | Design | ✅ Verified by design |
| NAV-05 | P1: Tela Home | Design | ✅ Verified |
| NAV-06 | P1: Tela Home | Design | ✅ Verified |
| NAV-07 | P1: Telas Placeholder | Design | ✅ Verified |
| NAV-08 | P1: Telas Placeholder | Design | ✅ Verified |
| NAV-09 | P1: Telas Placeholder | Design | ✅ Verified |
| NAV-E01 | Edge Case | Design | ✅ Verified by design |
| NAV-E02 | Edge Case | Design | ✅ Verified by design |
| NAV-E03 | Edge Case | Design | ✅ Verified by design |

**Coverage:** 12 total, 12 verified ✅

---

## Success Criteria

- [ ] Usuário consegue navegar entre 4 abas sem travamentos
- [ ] Cada tela exibe conteúdo correto em pt-BR
- [ ] Layout funciona em Android e iOS (testado em ambos)
- [ ] Testes unitários passam para todos os componentes de navegação
