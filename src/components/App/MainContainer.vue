<template>
  <main
    class="grid print:block print:bg-white p-3 mx-auto max-w-[800px] min-h-[300px] gap-1 relative"
    :class="{
      'grid-rows-[auto_auto_1fr] h-[calc(100vh-40px)]': !globalStore.fullscreenMode,
      'grid-rows-[1fr] h-screen': globalStore.fullscreenMode
    }"
  >
    <SearchContainer v-if="!globalStore.fullscreenMode" />
    <TimetableWarnings v-if="!globalStore.fullscreenMode" />
    <TimetableContainer />
  </main>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import TimetableContainer from '../Timetable/TimetableContainer.vue';
import TimetableWarnings from '../Timetable/TimetableWarnings.vue';
import SearchContainer from '../TimetableSearch/SearchContainer.vue';

const globalStore = useGlobalStore();
</script>
