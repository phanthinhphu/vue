<template>
  <div class="app-search">
    <AppIcon name="mdi:magnify" :size="16" class="app-search__icon" />
    <input
      :value="modelValue"
      :placeholder="placeholder ?? 'Search...'"
      class="app-search__input"
      type="search"
      v-bind="$attrs"
      @input="onInput"
    />
    <AppIcon
      v-if="loading"
      name="svg-spinners:ring-resize"
      :size="14"
      class="app-search__spinner"
    />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import AppIcon from '../app-icon/AppIcon.vue'
import type { AppSearchInputProps } from './AppSearchInput.type'

const props = withDefaults(defineProps<AppSearchInputProps>(), {
  debounce: 300,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

const debouncedSearch = useDebounceFn((val: string) => {
  emit('search', val)
}, props.debounce)

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  debouncedSearch(val)
}
</script>

<style scoped>
.app-search {
  position: relative;
  display: flex;
  align-items: center;
}

.app-search__icon {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.app-search__input {
  width: 100%;
  height: var(--input-height);
  padding: 0 var(--space-3) 0 36px;
  font-family: var(--font-family-base);
  font-size: var(--input-font-size);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--input-border-radius);
  outline: none;
  transition: border-color var(--duration-fast) var(--easing-default);
}

.app-search__input:focus {
  border-color: var(--color-primary);
}

.app-search__input::-webkit-search-cancel-button {
  display: none;
}

.app-search__spinner {
  position: absolute;
  right: var(--space-3);
  color: var(--color-text-secondary);
}
</style>
