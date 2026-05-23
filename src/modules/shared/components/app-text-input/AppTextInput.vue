<template>
  <div class="app-input" :class="{ 'app-input--error': error, 'app-input--disabled': disabled }">
    <label v-if="label" class="app-input__label">
      {{ label }}<span v-if="required" class="app-input__required" aria-hidden="true"> *</span>
    </label>
    <div class="app-input__wrapper">
      <AppIcon v-if="iconLeft" :name="iconLeft" :size="16" class="app-input__icon-left" />
      <InputText
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input__field"
        :class="{ 'app-input__field--icon-left': iconLeft, 'app-input__field--has-error': error }"
        v-bind="$attrs"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
    </div>
    <span v-if="error" class="app-input__error-msg" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import AppIcon from '../app-icon/AppIcon.vue'
import type { AppTextInputProps } from './AppTextInput.type'

defineProps<AppTextInputProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()
</script>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.app-input__required {
  color: var(--color-status-expired);
}

.app-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-input__icon-left {
  position: absolute;
  left: var(--space-3);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.app-input__field {
  width: 100%;
  height: var(--input-height);
  font-size: var(--input-font-size);
  font-family: var(--font-family-base);
  border-radius: var(--input-border-radius);
}

.app-input__field--icon-left {
  padding-left: 36px;
}

.app-input__field--has-error {
  border-color: var(--color-status-expired) !important;
}

.app-input__error-msg {
  font-size: var(--font-size-sm);
  color: var(--color-status-expired);
}

.app-input--disabled {
  opacity: 0.5;
}
</style>
