# Fase 2 — Catálogo de Produtos Specification

## Problem Statement

O app Cartflow possui navegação e telas placeholder, mas não há produtos cadastrados. O usuário não consegue visualizar, buscar ou cadastrar produtos. Sem um catálogo de produtos, não é possível criar listas de compras com itens (Fase 3).

## Goals

- [ ] Usuário pode navegar por uma lista de produtos categorizados
- [ ] Usuário pode buscar produtos por nome textualmente
- [ ] Usuário pode cadastrar novos produtos manualmente
- [ ] Produtos persistem entre sessões (MMKV)
- [ ] Produtos mockados existem para teste inicial

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Edição de produto | Será adicionada em fase futura se necessário |
| Exclusão de produto | Será adicionada em fase futura se necessário |
| Código de barras | Fase 6 (pós-MVP) |
| Histórico de preços | Fase 5 (pós-MVP) |
| Foto do produto | Fase futura |
| Ordenação por preço/data | MVP mínimo — ordenação alfabética padrão |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Store de produtos | Zustand + MMKV (mesmo padrão do CartStore) | Consistência com Fase 1; MMKV já configurado | n |
| Lista virtualizada | @legendapp/list | Já está nas dependências do projeto | n |
| Categoria opcional | Fallback "Sem categoria" | O tipo Product já tem `category?: string` | n |
| Preço esperado opcional | Pode ser vazio ao cadastrar | O tipo Product já tem `expectedPrice?: number` | n |
| Busca textual | Filtro local por nome (case-insensitive) | Sem backend; MMKV não suporta queries complexas | n |

**Open questions:** none — all resolved or logged above.

---

## User Stories

### P1: Lista de Produtos com Categorias ⭐ MVP

**User Story**: Como usuário, quero ver uma lista de produtos organizada por categorias para encontrar rapidamente o que preciso.

**Why P1**: É a tela principal do catálogo — sem ela o usuário não consegue visualizar produtos.

**Acceptance Criteria**:

1. PROD-01: WHEN usuário acessa a aba Produtos THEN sistema SHALL exibir lista de produtos agrupados por categoria
2. PROD-02: WHEN usuário rola a lista THEN sistema SHALL renderizar com @legendapp/list (virtualizada)
3. PROD-03: WHEN uma categoria não possui produtos THEN sistema SHALL ocultá-la (não exibir categoria vazia)

**Independent Test**: Abrir app → aba Produtos → ver produtos agrupados por categoria → scroll suave.

---

### P1: Busca de Produtos ⭐ MVP

**User Story**: Como usuário, quero buscar produtos pelo nome para encontrar rapidamente um item específico.

**Why P1**: Catálogos com muitos produtos exigem busca — essencial para usabilidade.

**Acceptance Criteria**:

1. PROD-04: WHEN usuário digita no campo de busca THEN sistema SHALL filtrar produtos cujo nome contenha o termo (case-insensitive)
2. PROD-05: WHEN busca não encontra resultados THEN sistema SHALL exibir mensagem "Nenhum produto encontrado"
3. PROD-06: WHEN usuário limpa o campo de busca THEN sistema SHALL restaurar a lista completa

**Independent Test**: Digitar "arroz" → ver só produtos com "arroz" no nome → limpar → ver lista completa.

---

### P1: Cadastro Manual de Produto ⭐ MVP

**User Story**: Como usuário, quero cadastrar um novo produto manualmente para incluí-lo no catálogo.

**Why P1**: Sem cadastro, o catálogo é fixo — o usuário precisa poder adicionar produtos.

**Acceptance Criteria**:

1. PROD-07: WHEN usuário toca em "Novo Produto" THEN sistema SHALL exibir formulário com campos: nome (obrigatório), categoria (opcional), preço esperado (opcional)
2. PROD-08: WHEN usuário submete o formulário com nome válido THEN sistema SHALL salvar o produto na store e redirecionar para a lista
3. PROD-09: WHEN usuário tenta submeter sem nome THEN sistema SHALL exibir erro "Nome é obrigatório"
4. PROD-10: WHEN usuário cancela o cadastro THEN sistema SHALL retornar à lista sem salvar

**Independent Test**: Tocar "Novo Produto" → preencher nome → salvar → ver produto na lista.

---

### P1: Produtos Mockados ⭐ MVP

**User Story**: Como usuário, quero ver produtos pré-cadastrados ao abrir o app pela primeira vez para testar a funcionalidade.

**Why P1**: Sem seed data, o catálogo fica vazio na primeira execução — impede teste imediato.

**Acceptance Criteria**:

1. PROD-11: WHEN app é aberto pela primeira vez (store vazia) THEN sistema SHALL inicializar com produtos mockados
2. PROD-12: WHEN produtos mockados já foram carregados THEN sistema NÃO SHALL duplicá-los em reinicializações

**Independent Test**: Limpar dados do app → abrir → ver produtos mockados → fechar/reabrir → mesma lista sem duplicatas.

---

## Edge Cases

- PROD-E01: WHEN nome do produto tem apenas espaços THEN sistema SHALL tratar como inválido (mesmo erro de nome obrigatório)
- PROD-E02: WHEN preço esperado é negativo THEN sistema SHALL exibir erro "Preço deve ser positivo"
- PROD-E03: WHEN nome do produto excede 100 caracteres THEN sistema SHALL exibir erro "Nome muito longo (máx. 100 caracteres)"
- PROD-E04: WHEN store falha ao salvar (MMKV) THEN sistema SHALL exibir erro "Erro ao salvar produto"

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| PROD-01 | P1: Lista de Produtos | Pending | Pending |
| PROD-02 | P1: Lista de Produtos | Pending | Pending |
| PROD-03 | P1: Lista de Produtos | Pending | Pending |
| PROD-04 | P1: Busca de Produtos | Pending | Pending |
| PROD-05 | P1: Busca de Produtos | Pending | Pending |
| PROD-06 | P1: Busca de Produtos | Pending | Pending |
| PROD-07 | P1: Cadastro Manual | Pending | Pending |
| PROD-08 | P1: Cadastro Manual | Pending | Pending |
| PROD-09 | P1: Cadastro Manual | Pending | Pending |
| PROD-10 | P1: Cadastro Manual | Pending | Pending |
| PROD-11 | P1: Produtos Mockados | Pending | Pending |
| PROD-12 | P1: Produtos Mockados | Pending | Pending |
| PROD-E01 | Edge Case | Pending | Pending |
| PROD-E02 | Edge Case | Pending | Pending |
| PROD-E03 | Edge Case | Pending | Pending |
| PROD-E04 | Edge Case | Pending | Pending |

**Coverage:** 16 total, 0 verified

---

## Success Criteria

- [ ] Usuário navega por lista virtualizada de produtos sem engasgos
- [ ] Busca textual funciona em tempo real
- [ ] Produtos cadastrados persistem entre sessões
- [ ] Seed data carrega na primeira execução sem duplicação
- [ ] Testes unitários passam para store, componentes de lista e formulário
