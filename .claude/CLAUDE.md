# Project: Vue3 Clean Template — MCO Management Tool

## Stack
- Vue 3 + TypeScript + Vite 7
- PrimeVue 4 (Aura theme preset, customized)
- Pinia 3 (state management)
- Vue Router 4
- Tailwind CSS 4
- Vitest + @vue/test-utils (unit + component tests)
- Axios (via BaseRepository)
- Font: Open Sans 14px, weight 600 (Semibold) — global default
- Icons: @iconify/vue

## Design Token System
All visual values come from CSS custom properties — never hardcode colors/sizes.

Token files live in `src/assets/tokens/`:
- `_primitives.css` — raw values (palettes, spacing scale)
- `_semantic.css`   — contextual aliases (--color-sidebar-bg, --color-status-active)
- `_components.css` — per-component tokens (--btn-height-md, --table-row-height)
- `tokens.css`      — imports all three

Import chain: `main.css` → `tokens.css` + `tailwind.css`

## Shared Component Library
All reusable UI components live in `src/modules/shared/components/`.
Naming convention: `App` prefix (AppButton, AppDataTable, AppSidebar, etc.)
Barrel export: `src/modules/shared/components/index.ts`

Atomic hierarchy:
- Atoms:     AppButton, AppBadge, AppIcon, AppAvatar, AppSkeleton, AppEmptyState
- Molecules: AppDataTable, AppTextInput, AppSelect, AppSearchInput, AppPageHeader
- Organisms: AppSidebar, AppTopBar, AppLayout

## Clean Architecture Layers
```
domain/         → Entities, Interfaces, Services (pure business logic, no Vue)
infrastructure/ → Repository implementations, HTTP client (extends BaseRepository)
modules/shared/ → Shared tokens, components, composables, layouts, utils
modules/[feat]/ → Feature modules (components/composables/stores/views/router/types)
plugins/        → Vue plugin wiring (PrimeVue, i18n, services)
router/         → Global router, registers all module routes
```

## Module Structure Convention
```
modules/[feature]/
  components/[component-name]/
    ComponentName.vue
    ComponentName.type.ts
    ComponentName.spec.ts
    index.ts
  composables/use-[name]/
    useName.ts + useName.spec.ts + index.ts
  stores/[name]/
    name.ts + name.spec.ts
  utils/         ← domain-to-UI mapping (e.g., statusMapper.ts)
  types/index.ts
  constants/index.ts
  mocks/
  router/index.ts
  views/ViewName.vue
```

## Key Rules
1. No hardcoded colors/fonts/sizes in components — use CSS custom properties
2. All shared UI goes through `AppXxx` components — no raw PrimeVue in feature views
3. Domain status/enum → badge variant mapping lives in `modules/[feat]/utils/`, not in shared
4. Every shared component has: `.vue` + `.type.ts` + `.spec.ts` + `index.ts`
5. MSAL disabled — controlled by `VITE_USE_MSAL_CLIENT` env var

## Active Feature Plan
See [MCO-PLAN.md](MCO-PLAN.md) for full implementation plan.
Sections: Design Tokens → Domain → Infrastructure → Atoms → Molecules → Organisms → MCO Module → Tests

## Commands
- `npm run dev`        — dev server
- `npm test`           — Vitest (watch mode)
- `npm run type-check` — vue-tsc
- `npm run lint`       — eslint --fix
- `npm run build`      — production build
