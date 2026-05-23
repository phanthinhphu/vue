<template>
  <div class="app-layout">
    <AppSidebar
      :items="activeSidebarItems"
      :logo-src="logoSrc"
      @navigate="onNavigate"
    />
    <AppTopBar
      :app-title="appTitle"
      :tabs="activeTopBarTabs"
      :user="user"
      @tab-change="onTabChange"
    />
    <main class="app-layout__content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '../app-sidebar/AppSidebar.vue'
import AppTopBar from '../app-top-bar/AppTopBar.vue'
import type { AppLayoutProps } from './AppLayout.type'

const props = defineProps<AppLayoutProps>()

const route = useRoute()
const router = useRouter()

const activeSidebarItems = computed(() =>
  props.sidebarItems.map((item) => ({
    ...item,
    active: route.name === item.routeName,
  })),
)

const activeTopBarTabs = computed(() =>
  props.topBarTabs.map((tab) => ({
    ...tab,
    active: route.name?.toString().startsWith(tab.key) ?? false,
  })),
)

function onNavigate(routeName: string) {
  router.push({ name: routeName })
}

function onTabChange(key: string) {
  const tab = props.topBarTabs.find((t) => t.key === key)
  if (tab) router.push({ name: tab.key })
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout__content {
  margin-left: var(--sidebar-width);
  margin-top: var(--topbar-height);
  height: calc(100vh - var(--topbar-height));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  background-color: var(--color-page-bg);
}
</style>
