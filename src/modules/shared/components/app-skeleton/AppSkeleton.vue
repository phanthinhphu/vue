<template>
  <span aria-hidden="true" class="app-skeleton" :class="`app-skeleton--${variant}`">
    <template v-if="variant === 'text'">
      <span
        v-for="n in rows"
        :key="n"
        class="app-skeleton__line"
        :style="{ width: n === rows && rows > 1 ? '70%' : width, height }"
      />
    </template>
    <span
      v-else
      class="app-skeleton__block"
      :style="{ width, height }"
    />
  </span>
</template>

<script setup lang="ts">
import type { AppSkeletonProps } from './AppSkeleton.type'

withDefaults(defineProps<AppSkeletonProps>(), {
  variant: 'rect',
  width: '100%',
  height: '16px',
  rows: 1,
})
</script>

<style scoped>
.app-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-skeleton__line,
.app-skeleton__block {
  display: block;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.app-skeleton--circle .app-skeleton__block {
  border-radius: var(--radius-full);
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
