<template>
  <div class="app-layout" :data-theme="settings.theme">
    <AppSidebar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import { useSettingsStore } from './stores/settings'

const settings = useSettingsStore()
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
  color: var(--text-primary);
}
.main-content {
  flex: 1;
  height: 100vh;
  overflow: hidden; /* важно: чтобы дочерние элементы могли управлять скроллом */
}
</style>