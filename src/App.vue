<template>
  <div class="text-white min-h-screen bg-zinc-950">
    <Navbar />
    <MainContainer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from './components/App/Navbar.vue';
import MainContainer from './components/App/MainContainer.vue';
import { onMounted } from 'vue';
import { useApiStore } from './stores/api.store';
import { useGlobalStore } from './stores/global.store';

const originalDocumentTitle = document.title;

const apiStore = useApiStore();
const globalStore = useGlobalStore();

onMounted(() => {
  apiStore.setupAPIData();

  // Setup dark mode
  globalStore.darkMode =
    localStorage.currentTheme === 'dark' || (!('currentTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
});

// Resetting after print dialog is closed
window.addEventListener('afterprint', () => {
  document.title = originalDocumentTitle;
});
</script>
