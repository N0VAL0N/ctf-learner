<template>
  <aside class="sidebar">
    <div class="logo">CTF Learner</div>
    <nav>
      <router-link to="/" class="nav-item" active-class="active">
        <SvgIcon name="home" :size="20" />
        <span class="label">{{ translate('nav.home') }}</span>
      </router-link>
      <router-link to="/lessons" class="nav-item" active-class="active">
        <SvgIcon name="lessons" :size="20" />
        <span class="label">{{ translate('nav.lessons') }}</span>
      </router-link>
      <router-link to="/practice" class="nav-item" active-class="active">
        <SvgIcon name="practice" :size="20" />
        <span class="label">{{ translate('nav.practice') }}</span>
      </router-link>
      <router-link to="/library" class="nav-item" active-class="active">
        <SvgIcon name="library" :size="20" />
        <span class="label">{{ translate('nav.library') }}</span>
      </router-link>
      <router-link to="/compiler" class="nav-item" active-class="active">
        <SvgIcon name="compiler" :size="20" />
        <span class="label">{{ translate('nav.compiler') }}</span>
      </router-link>
      <button @click="openSettings" class="nav-item settings-btn">
        <SvgIcon name="settings" :size="20" />
        <span class="label">{{ translate('nav.settings') }}</span>
      </button>
    </nav>

    <!-- Модалка настроек -->
    <SettingsModal v-if="settingsModalOpen" @close="settingsModalOpen = false" />
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@/composables/useLocale'
import SettingsModal from '@/views/SettingsModal.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const { translate } = useLocale()
const settingsModalOpen = ref(false)

const openSettings = () => {
  settingsModalOpen.value = true
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar .logo {
  padding: 0 1.5rem 2rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  background: none;
  border-right: none;
  border-top: none;
  border-bottom: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--bg-hover);
  border-left-color: var(--accent);
  color: var(--accent);
}
.settings-btn {
  margin-top: auto;
}
.label { font-size: 0.95rem; }
@media (max-width: 768px) {
  .sidebar { width: 60px; }
  .sidebar .logo { font-size: 0; padding-bottom: 1rem; }
  .sidebar .logo::before { content: 'CTF'; font-size: 1rem; font-weight: 700; }
  .label { display: none; }
  .nav-item { justify-content: center; padding: 0.6rem 0; }
}
</style>