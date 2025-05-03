<template>
  <div
    class="overflow-auto p-1 bg-white print:bg-white dark:bg-zinc-950 print:text-black text-black dark:text-white min-h-full relative"
    :class="{ dark: globalStore.darkMode }"
  >
    <!-- <button
      v-if="globalStore.fullscreenMode"
      class="fixed right-0 top-0 bg-green-600 p-1 m-1 rounded-md hover:bg-green-500 print:hidden"
      @click="() => (globalStore.fullscreenMode = false)"
    >
      <Minimize2Icon :size="22" />
    </button> -->

    <TimetableContent />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import TimetableContent from '../Timetable/TimetableContent.vue';

const globalStore = useGlobalStore();
</script>
