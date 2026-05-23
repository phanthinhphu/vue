<template>
  <header class="app-topbar">
    <div class="app-topbar__brand">
      <span class="app-topbar__title">{{ appTitle }}</span>
    </div>

    <nav class="app-topbar__tabs" aria-label="Application tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="app-topbar__tab"
        :class="{ 'app-topbar__tab--active': tab.active }"
        :aria-current="tab.active ? 'page' : undefined"
        @click="emit('tab-change', tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="app-topbar__user">
      <span class="app-topbar__user-name">{{ user.name }}</span>
      <AppAvatar
        :initials="user.initials"
        :src="user.avatarSrc"
        size="sm"
        :aria-label="`${user.name} avatar`"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import AppAvatar from '../app-avatar/AppAvatar.vue'
import type { AppTopBarProps } from './AppTopBar.type'

defineProps<AppTopBarProps>()
const emit = defineEmits<{ 'tab-change': [key: string] }>()
</script>

<style scoped>
.app-topbar {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--topbar-height);
  background-color: var(--color-header-bg);
  display: flex;
  align-items: stretch;
  z-index: calc(var(--z-dropdown) - 1);
  flex-shrink: 0;
}

.app-topbar__brand {
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  flex-shrink: 0;
}

.app-topbar__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-inverse);
  white-space: nowrap;
}

.app-topbar__tabs {
  display: flex;
  align-items: stretch;
  flex: 1;
}

.app-topbar__tab {
  display: flex;
  align-items: center;
  padding: 0 var(--topbar-tab-px);
  height: var(--topbar-tab-height);
  background: none;
  border: none;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-tab-text);
  cursor: pointer;
  opacity: 0.75;
  transition: opacity var(--duration-fast) var(--easing-default),
              background-color var(--duration-fast) var(--easing-default);
  white-space: nowrap;
}

.app-topbar__tab:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.08);
}

.app-topbar__tab--active {
  background-color: var(--color-tab-active-bg);
  color: var(--color-tab-active-text);
  opacity: 1;
}

.app-topbar__tab:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.app-topbar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-4);
  margin-left: auto;
  flex-shrink: 0;
}

.app-topbar__user-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
}
</style>
