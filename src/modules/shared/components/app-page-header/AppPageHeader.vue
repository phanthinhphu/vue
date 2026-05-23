<template>
  <div class="app-page-header">
    <div class="app-page-header__text">
      <h1 class="app-page-header__title">{{ title }}</h1>
      <p v-if="description" class="app-page-header__description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="app-page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppPageHeaderProps } from './AppPageHeader.type'

defineProps<AppPageHeaderProps>()
</script>

<style scoped>
.app-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--page-header-height);
  padding: 0 var(--space-6);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.app-page-header__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-page-header__title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}

.app-page-header__description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.app-page-header__actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}
</style>
