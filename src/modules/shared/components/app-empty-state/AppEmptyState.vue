<template>
  <div class="app-empty-state">
    <AppIcon v-if="icon" :name="icon" :size="48" class="app-empty-state__icon" />
    <p class="app-empty-state__title">{{ title }}</p>
    <p v-if="description" class="app-empty-state__description">{{ description }}</p>
    <div v-if="$slots.actions" class="app-empty-state__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '../app-icon/AppIcon.vue'
import type { AppEmptyStateProps } from './AppEmptyState.type'

defineProps<AppEmptyStateProps>()
</script>

<style scoped>
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-10);
  text-align: center;
}

.app-empty-state__icon {
  color: var(--color-text-disabled);
}

.app-empty-state__title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.app-empty-state__description {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.app-empty-state__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
</style>
