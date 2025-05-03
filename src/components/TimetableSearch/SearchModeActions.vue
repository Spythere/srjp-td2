<template>
  <div class="flex justify-between gap-2" v-if="!globalStore.fullscreenMode">
    <div class="flex gap-2">
      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'active'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('active')"
      >
        <WifiIcon />
      </button>

      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'storage'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('storage')"
      >
        <ArchiveIcon />
      </button>

      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'journal'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('journal')"
      >
        <HistoryIcon />
      </button>
    </div>

    <div class="flex gap-2">
      <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="toggleDarkMode">
        <MoonIcon v-if="globalStore.darkMode" />
        <SunIcon v-else />
      </button>

      <button
        class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 disabled:opacity-60 disabled:hover:bg-zinc-800"
        @click="toggleFullscreenMode()"
        :disabled="globalStore.currentTimetableData == null"
      >
        <FullscreenIcon :size="24" />
      </button>

      <button
        class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 disabled:opacity-60 disabled:hover:bg-zinc-800"
        :disabled="globalStore.currentTimetableData == null"
        @click="openPrintingWindow"
      >
        <PrinterIcon />
      </button>

      <button
        class="p-1 rounded-md disabled:opacity-60 disabled:hover:bg-zinc-800"
        :disabled="globalStore.currentTimetableData == null"
        :class="{
          'bg-green-600 hover:bg-green-700': isTimetableSaved,
          'bg-zinc-800 hover:bg-zinc-700': !isTimetableSaved
        }"
        @click="saveToStorage"
      >
        <FolderDownIcon />
      </button>
    </div>
  </div>

  <div class="flex justify-end" v-else>
    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 self-end" @click="toggleDarkMode">
      <FullscreenIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import type { ViewMode, TimetableData } from '../../types/common.types';
import {
  ArchiveIcon,
  FolderDownIcon,
  FullscreenIcon,
  HistoryIcon,
  MoonIcon,
  PrinterIcon,
  SunIcon,
  WifiIcon
} from 'lucide-vue-next';

const globalStore = useGlobalStore();

// Computed
const isTimetableSaved = computed(() => {
  if (!globalStore.currentTimetableData) return false;

  return Object.keys(globalStore.storageTimetables).includes(
    `${globalStore.currentTimetableData.timetableId}`
  );
});

// Watchers
watch(
  () => globalStore.selectedActiveTrain,
  (curr) => {
    if (curr != null) {
      globalStore.generatedDate = new Date();
    }
  }
);

// Methods
function toggleViewMode(viewMode: ViewMode) {
  globalStore.viewMode = viewMode;
}

function toggleDarkMode() {
  globalStore.darkMode = !globalStore.darkMode;

  window.localStorage.setItem('currentTheme', globalStore.darkMode ? 'dark' : 'light');
}

function saveToStorage() {
  if (globalStore.currentTimetableData == null) return;

  try {
    const savedTimetablesStorage = localStorage.getItem('savedTimetables');
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage
      ? JSON.parse(savedTimetablesStorage)
      : {};

    if (savedTimetablesJSON[globalStore.currentTimetableData.timetableId] !== undefined) {
      globalStore.selectedStorageTimetable =
        savedTimetablesJSON[globalStore.currentTimetableData.timetableId];
      globalStore.viewMode = 'storage';

      return;
    }

    savedTimetablesJSON[globalStore.currentTimetableData.timetableId] = {
      ...globalStore.currentTimetableData,
      savedTimestamp: Date.now()
    };

    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetablesJSON));
    globalStore.storageTimetables = savedTimetablesJSON;
  } catch (error) {}
}

function openPrintingWindow() {
  if (globalStore.selectedActiveTrain != null) {
    const date = `${globalStore
      .generatedDate!.toLocaleDateString('pl-PL')
      .replace(/\./g, '-')}--${globalStore
      .generatedDate!.toLocaleTimeString('pl-PL')
      .replace(/:/g, '-')}`;

    document.title = `${globalStore.selectedActiveTrain.driverName} ; ${
      globalStore.selectedActiveTrain.timetable!.category
    } ${globalStore.selectedActiveTrain.trainNo}
        ${globalStore.selectedActiveTrain.timetable?.route.replace('|', ' - ')} ; ${date}`;
  }

  window.print();
}

function toggleFullscreenMode() {
  globalStore.fullscreenMode = !globalStore.fullscreenMode;
}
</script>
