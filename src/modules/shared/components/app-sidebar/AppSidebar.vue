<template>
  <nav class="app-sidebar" aria-label="Main navigation">
    <div class="app-sidebar__logo">
      <img :src="logoSrc" alt="Logo" class="app-sidebar__logo-img" />
    </div>

    <ul class="app-sidebar__nav" role="list">
      <li v-for="item in items" :key="item.routeName">
        <button
          class="app-sidebar__item"
          :class="{ 'app-sidebar__item--active': item.active }"
          :aria-label="item.label"
          v-tooltip.right="item.label"
          @click="emit('navigate', item.routeName)"
        >
          <AppIcon :name="item.icon" :size="20" :aria-label="item.label" />
        </button>
      </li>
    </ul>

    <div v-if="bottomLogoSrc" class="app-sidebar__bottom-logo">
      <img :src="bottomLogoSrc" alt="Bottom logo" class="app-sidebar__logo-img" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import AppIcon from '../app-icon/AppIcon.vue'
import type { AppSidebarProps } from './AppSidebar.type'

defineProps<AppSidebarProps>()
const emit = defineEmits<{ navigate: [routeName: string] }>()
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--color-sidebar-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: var(--z-dropdown);
  flex-shrink: 0;
}

.app-sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--topbar-height);
  width: 100%;
  flex-shrink: 0;
}

.app-sidebar__logo-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.app-sidebar__nav {
  list-style: none;
  margin: 0;
  padding: var(--space-2) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  width: 100%;
}

.app-sidebar__item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: var(--sidebar-item-height);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.65);
  transition: color var(--duration-fast) var(--easing-default),
              background-color var(--duration-fast) var(--easing-default);
  position: relative;
}

.app-sidebar__item:hover {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.08);
}

.app-sidebar__item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.app-sidebar__item--active {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.12);
}

.app-sidebar__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background-color: var(--color-accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.app-sidebar__bottom-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: var(--space-4);
}
</style>
