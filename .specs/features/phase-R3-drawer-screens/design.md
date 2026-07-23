# Phase R3 — Drawer Screens Design

## Architecture

### Component Hierarchy

```
ListsScreen
├── TitleText ("Minhas Listas")
├── SearchBar (TextInput — new, for filtering)
├── LegendList
│   └── ListCard (Pressable)
│       ├── CartInfo (name, item count)
│       └── ChevronIcon
├── NameInputModal (shared component)
│   ├── Modal overlay
│   ├── TextInput (pre-filled in rename mode)
│   └── Confirm/Cancel buttons
└── FAB (create new list)

ProductsScreen (existing, extended)
├── TitleText ("Produtos")
├── SearchBar (existing)
├── LegendList
│   ├── CategoryHeader (sticky)
│   └── ProductCard (Pressable, long-press → context menu)
│       ├── ProductName
│       └── ProductPrice
├── FAB (navigate to product-form)
└── Alert.alert context menu (edit/delete)

ProductFormScreen (existing, extended)
├── TitleText (dynamic: "Novo Produto" / "Editar Produto")
├── NameInput (TextInput)
├── CategoryInput (TextInput)
├── PriceInput (TextInput)
├── ButtonRow (Cancel / Save)
└── Uses useLocalSearchParams() to detect edit mode
```

### Component Design: NameInputModal

A reusable modal for list create/rename, consistent cross-platform:

```tsx
// Props:
{
  visible: boolean;
  title: string;        // "Nova Lista" or "Renomear Lista"
  initialValue?: string; // pre-fill for rename
  maxLength?: number;    // default 50
  onConfirm: (name: string) => void;
  onCancel: () => void;
}
```

Behavior:
- Opens with TextInput focused and keyboard shown
- Confirm button enabled only when trimmed input is non-empty and different from initialValue (for rename)
- Dismisses on confirm or cancel
- Uses existing design tokens (colors, spacing, borderRadius)

### Data Flow

**Lists CRUD:**
```
ListsScreen
  → NameInputModal (create) → addCart(name) → cartStore updates → list re-renders
  → NameInputModal (rename) → renameCart(id, newName) → cartStore updates → list re-renders
  → Alert.alert (delete confirm) → removeCart(id) → cartStore updates → list re-renders
```

**Products CRUD:**
```
ProductsScreen
  → Alert.alert (edit) → router.push('/product-form', { productId }) → ProductForm loads product
  → ProductForm (edit mode) → updateProduct(id, updates) → productStore updates → products re-renders
  → Alert.alert (delete confirm) → removeProduct(id) → productStore updates → products re-renders
```

### Product Form Edit Mode

The product form detects edit mode via `useLocalSearchParams()`:

```tsx
const { productId } = useLocalSearchParams<{ productId?: string }>();
const isEditMode = !!productId;

// Load existing product data
useEffect(() => {
  if (isEditMode) {
    const product = products.find(p => p.id === productId);
    if (product) {
      setName(product.name);
      setCategory(product.category || '');
      setExpectedPrice(product.expectedPrice?.toString() || '');
    }
  }
}, [productId, products]);

// Save handler branches on mode
const handleSave = () => {
  if (isEditMode) {
    updateProduct(productId, { name, category, expectedPrice });
  } else {
    addProduct({ name, category, expectedPrice });
  }
  router.back();
};
```

### Files to Modify

| File | Change |
|------|--------|
| `app/drawer/lists.tsx` | Replace Alert.prompt with NameInputModal; add long-press context menu with rename/delete |
| `app/drawer/products.tsx` | Add long-press to product cards with edit/delete context menu |
| `app/product-form.tsx` | Add edit mode via productId query param |
| `i18n/locales/pt-BR.json` | Add new i18n keys for modals and edit mode |
| `app/drawer/__tests__/ListsScreen.test.tsx` | Add CRUD flow tests |
| `app/drawer/__tests__/ProductsScreen.test.tsx` | Add edit/delete context menu tests |
| `app/__tests__/ProductForm.test.tsx` (new) | Add edit mode tests |

### i18n Keys to Add

```json
{
  "lists": {
    "createTitle": "Nova Lista",
    "renameTitle": "Renomear Lista",
    "namePlaceholder": "Nome da lista",
    "nameRequired": "Nome é obrigatório",
    "deleteConfirmTitle": "Excluir esta lista?",
    "deleteConfirmMessage": "Todos os itens serão removidos."
  },
  "products": {
    "editProduct": "Editar Produto",
    "deleteConfirmTitle": "Excluir este produto?",
    "deleteConfirmMessage": "O produto será removido do catálogo."
  }
}
```

### Patterns to Reuse

- **Modal pattern**: Follow `product-form.tsx` style (KeyboardAvoidingView + TextInput)
- **Context menu**: Follow existing `handleLongPress` pattern in `lists.tsx` (Alert.alert with options)
- **LegendList**: Already used in both screens, no changes
- **Design tokens**: All from `constants/colors.ts` and `constants/layout.ts`
- **Store methods**: `addCart`, `renameCart`, `removeCart`, `addProduct`, `updateProduct`, `removeProduct` — all already exist
