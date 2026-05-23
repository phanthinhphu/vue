<template>
  <span
    class="app-badge"
    :class="[`app-badge--${variant}`, { 'app-badge--dot': dot }]"
    role="status"
  >
    <span v-if="dot" class="app-badge__dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { AppBadgeProps } from './AppBadge.type'

withDefaults(defineProps<AppBadgeProps>(), {
  variant: 'neutral',
  dot: false,
})
</script>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--badge-font-size);
  font-weight: var(--badge-font-weight);
  white-space: nowrap;
}

.app-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: currentColor;
}

.app-badge--success {
  color: var(--color-status-active);
  background-color: color-mix(in srgb, var(--color-status-active) 12%, transparent);
}

.app-badge--danger {
  color: var(--color-status-expired);
  background-color: color-mix(in srgb, var(--color-status-expired) 12%, transparent);
}

.app-badge--warning {
  color: var(--color-status-pending);
  background-color: color-mix(in srgb, var(--color-status-pending) 12%, transparent);
}

.app-badge--info {
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.app-badge--neutral {
  color: var(--color-text-secondary);
  background-color: var(--color-gray-100);
}
</style>
