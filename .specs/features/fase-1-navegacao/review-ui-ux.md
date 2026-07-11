# UI/UX Review — `feature/fase-1-navegacao`

> Review focada na interface e experiência do usuário para um app de lista de compras React Native (iOS + Android).

---

## Resumo executivo

O scaffold cumpre o propósito funcional (navegação entre 4 abas + Home com call-to-action), mas a UI ainda é genérica ("estoque" — sem identidade visual definida). As oportunidades estão em: **estabelecer uma direção visual clara** antes da fase 2, **melhorar o feedback de toque**, e **evoluir o empty state** para algo útil.

---

## 1. Direção visual (Identidade)

**Status: ⚠️ Inexistente** — a UI atual é o padrão do framework sem personalidade.

| Aspecto | Atual | Recomendação |
|---------|-------|-------------|
| Paleta | `#4A90D9` (azul genérico) + `#7ED321` (verde), fundo branco | Escolher uma direção: limpo/profissional (azul suave + cinzas quentes), vibrante/divertido (laranja/mandarina), ou natural/orgânico (verde floresta + off-white). O azul `#4A90D9` é o "default blue" de milhares de apps |
| Tipografia | System default (San Francisco / Roboto) | Definir uma type scale modular. Não precisa de fontes customizadas ainda, mas o scale precisa existir: `h1: 32px bold`, `h2: 20px bold`, `body: 16px`, `caption: 14px` |
| Tom | Neutro, sem personalidade | Um app de compras pode ser divertido, confiável, ou minimalista — mas precisa escolher um |

**Sugestão:** Este é o momento certo para decidir o tema visual. Sugiro algo fresco mas profissional — tons terrosos/quentes (ex: `#E8652D` como primary, `#2D3436` como text, off-white de fundo). Foge do azul corporativo e combina com o conceito "natural" de compras (alimentos, feira).

---

## 2. Home Screen

**Arquivo: `app/(tabs)/index.tsx`**

### ✅ Acertos
- SafeArea respeitada (`paddingTop: insets.top + spacing.lg`)
- Hierarquia visual clara: título → subtítulo → CTA → seção
- `Pressable` no botão (correto para RN moderno)

### ❌ Issues

| # | Severidade | Onde | Problema |
|---|-----------|------|----------|
| U1 | **Média** | `index.tsx:15` | **Botão sem feedback de toque.** `Pressable` sem `style` animado — o usuário não vê resposta ao pressionar. Num app mobile, feedback tátil/visual é essencial |
| U2 | **Média** | `index.tsx:15` | **Botão sem `accessibilityRole="button"`** e sem `accessibilityLabel`. Leitores de tela não identificam como botão |
| U3 | **Alta** | `index.tsx:12-18` | **Empty state inexistente.** A área "Minhas Listas" está vazia — sem texto explicativo, sem ilustração, sem call-to-action secundário. É a primeira coisa que o usuário vê ao abrir o app |
| U4 | **Baixa** | `index.tsx:29-30` | **Título "Cartflow" é redundante** — o nome do app já está na tab bar e no header. O espaço poderia ser mais útil (ex: saudação "Olá, [nome]" ou subtítulo mais descritivo) |
| U5 | **Média** | `index.tsx:48` | **Cor do texto do botão é `#FFFFFF` hardcoded** — deveria vir de `colors.white` ou similar |

---

## 3. Tab Navigation

**Arquivo: `app/(tabs)/_layout.tsx`**

### ✅ Acertos
- `headerShown: false` (correto para tabs com conteúdo próprio)
- Cores de tab ativo/inativo definidas
- i18n implementado

### ❌ Issues

| # | Severidade | Onde | Problema |
|---|-----------|------|----------|
| U6 | **Alta** | `_layout.tsx:7-11` | **Ícones via emoji.** Emojis têm renderização inconsistente entre plataformas (iOS vs Android), não suportam tamanhos dinâmicos bem, e são inacessíveis. Preferir `@expo/vector-icons` ou ícones SF Symbol + Material |
| U7 | **Alta** | `_layout.tsx:23` | **Emoji sem `accessibilityLabel`.** Leitores de tela leem o caractere Unicode (ex: "emoji de casa" em vez de "Início") |
| U8 | **Média** | `_layout.tsx` | **Tab `lists` e `products` têm o mesmo placeholder.** O usuário vê duas telas idênticas com "Em breve" — confuso. Se ambas vão para a mesma tela, talvez devessem ser uma tab só |

---

## 4. Placeholder Screens (Lists, Products, Profile)

**Arquivos: `lists.tsx`, `products.tsx`, `profile.tsx`**

### ✅ Acertos
- Centralização vertical + horizontal
- SafeArea respeitada

### ❌ Issues

| # | Severidade | Onde | Problema |
|---|-----------|------|----------|
| U9 | **Média** | `lists.tsx:13-14` | **"Em breve" é genérico demais.** Um placeholder útil teria: (1) o que esperar da funcionalidade, (2) um ícone/ilustração, (3) CTA de notificação se possível. Ex: "Produtos — Cadastre produtos e veja preços. Em breve você poderá escanear códigos de barras!" |

---

## 5. UX Writing (Copy em Português)

**Arquivo: `i18n/locales/pt-BR.json`**

### ✅ Acertos
- Chaves bem organizadas por domínio (`home`, `cart`, `tabs`)
- Tom consistente

### ❌ Issues

| # | Severidade | Onde | Problema |
|---|-----------|------|----------|
| U10 | **Baixa** | `"subtitle": "Sua lista de compras inteligente"` | **"Sua lista de compras inteligente"** é uma frase nominal sem verbo. Funciona como tagline, mas poderia ser mais ativa: "Organize suas compras de forma inteligente" ou "Nunca mais esqueça nada" |

---

## 6. Interação e Microfeedback

**Issue crítica para um app mobile:**

- **Pressable sem feedback:** O botão "Nova Lista" não tem `style` animado (`pressed` state). Um `Pressable` sem feedback visual parece quebrado num app nativo.
- **Sem haptics:** `expo-haptics` traria feedback tátil no botão principal — diferença entre um app "ok" e um app "nativo".
- **Transições:** A navegação entre tabs usa a transição padrão do iOS/Android (ok), mas não há animação de entrada na Home.

---

## 7. Acessibilidade

| # | Severidade | Issue |
|---|-----------|-------|
| U11 | **Alta** | Tab bar icons sem `accessibilityLabel` ou `accessibilityRole` |
| U12 | **Média** | Botão "Nova Lista" sem `accessibilityRole="button"` |
| U13 | **Média** | Nenhuma tela tem `accessibilityLabel` nos elementos interativos |

---

## Prioridade de ações

| Prioridade | Issues | Ação |
|-----------|--------|------|
| **P0 — Antes da fase 2** | U1, U3, U6, U7, U11 | Feedback de toque no botão, empty state na Home, substituir emojis por vetores, acessibilidade na tab bar |
| **P1 — Durante fase 2** | U8, U9 | Diferenciar placeholders com descrições úteis |
| **P2 — Refinamento** | U2, U4, U5, U10, U12 | Constantes de cor, revisão de copy, acessibilidade fina |
| **P3 — Visão** | — | Definir direção visual (paleta, tipografia, tom) antes de acumular telas |
