<template>
  <div class="min-h-screen bg-zinc-950">
    <Navbar />
    <MainContainer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from './components/App/Navbar.vue';
import MainContainer from './components/App/MainContainer.vue';
import { onMounted } from 'vue';
import { useApiStore } from './stores/api.store';

const originalDcumentTitle = document.title;

const apiStore = useApiStore();

onMounted(() => {
  apiStore.setupAPIData();
});

// Resetting after print dialog is closed
window.addEventListener('afterprint', () => {
  document.title = originalDcumentTitle;
});
</script>
