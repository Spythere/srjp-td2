<template>
  <div
    class="overflow-auto p-1 bg-white print:bg-white dark:bg-zinc-950 print:text-black text-black dark:text-white min-h-full"
    :class="{ dark: globalStore.darkMode }"
  >
    <TimetableContent />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import TimetableContent from '../Timetable/TimetableContent.vue';

const globalStore = useGlobalStore();
</script>
