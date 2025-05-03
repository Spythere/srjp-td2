<template>
  <!-- Timetable render based on current view mode -->
  <CurrentTimetableView v-if="globalStore.currentTimetableData != null" />

  <!-- Button closing fullscreen mode, relative to MainContainer -->
  <button
    v-if="globalStore.fullscreenMode"
    class="absolute right-6 top-3 p-1  rounded-md bg-green-600 hover:bg-green-500 print:hidden"
    @click="() => (globalStore.fullscreenMode = false)"
  >
    <Minimize2Icon :size="22" />
  </button>

  <!-- If there is no timetable chosen -->
  <div class="overflow-auto text-center font-bold text-zinc-400 p-1 min-h-full" v-else>
    <component :is="viewModes[globalStore.viewMode]" />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import LocalStorageView from '../TimetableViews/LocalStorageView.vue';
import JournalStorageView from '../TimetableViews/JournalStorageView.vue';
import ActiveDataView from '../TimetableViews/ActiveDataView.vue';
import CurrentTimetableView from '../TimetableViews/CurrentTimetableView.vue';
import { Minimize2Icon } from 'lucide-vue-next';

const globalStore = useGlobalStore();

const viewModes: Record<typeof globalStore.viewMode, any> = {
  active: ActiveDataView,
  storage: LocalStorageView,
  journal: JournalStorageView
};
</script>
