<template>
  <div class="app-select" :class="{ 'app-select--error': error, 'app-select--disabled': disabled }">
    <label v-if="label" class="app-select__label">{{ label }}</label>
    <Select
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :loading="loading"
      class="app-select__field"
      :class="{ 'app-select__field--has-error': error }"
      v-bind="$attrs"
      @change="onSelectChange"
    />
    <span v-if="error" class="app-select__error-msg" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import Select from 'primevue/select'
import type { AppSelectProps } from './AppSelect.type'

defineProps<AppSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

function onSelectChange(e: { value: unknown }) {
  emit('update:modelValue', e.value)
  emit('change', e.value)
}
</script>

<style scoped>
.app-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-select__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.app-select__field {
  height: var(--select-height);
  font-family: var(--font-family-base);
  font-size: var(--input-font-size);
  width: 100%;
}

.app-select__field--has-error {
  border-color: var(--color-status-expired) !important;
}

.app-select__error-msg {
  font-size: var(--font-size-sm);
  color: var(--color-status-expired);
}

.app-select--disabled {
  opacity: 0.5;
}
</style>
