<template>
  <button
    class="app-btn"
    :class="[`app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="emit('click', $event)"
  >
    <AppIcon v-if="loading" name="svg-spinners:ring-resize" :size="iconSize" class="app-btn__spinner" />
    <AppIcon v-else-if="iconLeft" :name="iconLeft" :size="iconSize" class="app-btn__icon-left" />
    <span v-if="$slots.default" class="app-btn__label"><slot /></span>
    <AppIcon v-if="iconRight && !loading" :name="iconRight" :size="iconSize" class="app-btn__icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '../app-icon/AppIcon.vue'
import type { AppButtonProps } from './AppButton.type'

const props = withDefaults(defineProps<AppButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const iconSize = computed(() => {
  if (props.size === 'sm') return 14
  if (props.size === 'lg') return 18
  return 16
})
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--btn-radius);
  font-family: var(--font-family-base);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--easing-default),
              opacity var(--duration-fast) var(--easing-default);
  white-space: nowrap;
}

.app-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Sizes */
.app-btn--sm { height: var(--btn-height-sm); padding: 0 var(--btn-px-sm); }
.app-btn--md { height: var(--btn-height-md); padding: 0 var(--btn-px-md); }
.app-btn--lg { height: var(--btn-height-lg); padding: 0 var(--space-5); }

/* Variants */
.app-btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
.app-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.app-btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.app-btn--secondary:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.app-btn--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
}
.app-btn--ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.app-btn--danger {
  background-color: var(--color-status-expired);
  color: var(--color-white);
}
.app-btn--danger:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--color-status-expired) 85%, black);
}
</style>
