<template>
  <!-- Button closing fullscreen mode, relative to MainContainer -->
  <button
    v-if="globalStore.fullscreenMode"
    class="absolute right-6 top-3 p-1 rounded-md bg-green-600 hover:bg-green-500 print:hidden z-50"
    @click="() => (globalStore.fullscreenMode = false)"
  >
    <Minimize2Icon :size="22" />
  </button>

  <!-- If there is no timetable chosen -->
  <div
    class="overflow-auto text-center font-bold text-zinc-400 p-2 min-h-full"
    v-if="globalStore.currentTimetableData == null"
  >
    <component :is="viewModes[globalStore.viewMode]" />
  </div>

  <div
    class="overflow-auto text-center font-bold text-white p-2 min-h-full"
    v-else-if="apiStore.apiDataStatus == DataStatus.LOADING"
  >
    Pobieranie danych...
  </div>

  <div
    class="overflow-auto text-center font-bold text-red-500 p-2 min-h-full"
    v-else-if="apiStore.apiDataStatus == DataStatus.ERROR"
  >
    Ups! Coś poszło nie tak przy pobieraniu danych! :/
  </div>

  <!-- Timetable render based on current view mode -->
  <CurrentTimetableView v-else />
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import LocalStorageView from '../TimetableViews/LocalStorageView.vue';
import JournalStorageView from '../TimetableViews/JournalStorageView.vue';
import ActiveDataView from '../TimetableViews/ActiveDataView.vue';
import CurrentTimetableView from '../TimetableViews/CurrentTimetableView.vue';
import { Minimize2Icon } from 'lucide-vue-next';
import { useApiStore } from '../../stores/api.store';
import { DataStatus } from '../../types/api.types';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

const viewModes: Record<typeof globalStore.viewMode, any> = {
  active: ActiveDataView,
  storage: LocalStorageView,
  journal: JournalStorageView
};
</script>
