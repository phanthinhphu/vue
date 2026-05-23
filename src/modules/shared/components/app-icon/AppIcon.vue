<template>
  <Icon
    :icon="name"
    :width="size"
    :height="size"
    :color="color"
    :aria-label="ariaLabel"
    :aria-hidden="!ariaLabel"
    class="app-icon"
  />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { AppIconProps } from './AppIcon.type'

withDefaults(defineProps<AppIconProps>(), {
  size: 16,
  color: 'currentColor',
})
</script>

<style scoped>
.app-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
