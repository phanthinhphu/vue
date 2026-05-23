<template>
  <span
    class="app-avatar"
    :class="`app-avatar--${size}`"
    :aria-label="ariaLabel"
  >
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="ariaLabel ?? initials"
      class="app-avatar__img"
      @error="imgError = true"
    />
    <span v-else class="app-avatar__initials">{{ initials }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AppAvatarProps } from './AppAvatar.type'

withDefaults(defineProps<AppAvatarProps>(), {
  size: 'md',
})

const imgError = ref(false)
</script>

<style scoped>
.app-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--color-navy-700);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  flex-shrink: 0;
}

.app-avatar--sm  { width: 28px; height: 28px; font-size: var(--font-size-xs); }
.app-avatar--md  { width: 36px; height: 36px; font-size: var(--font-size-sm); }
.app-avatar--lg  { width: 48px; height: 48px; font-size: var(--font-size-base); }

.app-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-avatar__initials {
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
}
</style>
