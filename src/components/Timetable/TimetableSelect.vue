<template>
  <div class="flex gap-2 justify-between flex-wrap mb-2 print:hidden">
    <div class="flex gap-2">
      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'active'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('active')"
      >
        <WifiIcon class="size-6" />
      </button>

      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'storage'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('storage')"
      >
        <ArchiveBoxArrowDownIcon class="size-6" />
      </button>

      <button
        :class="`p-1 rounded-md ${
          globalStore.viewMode == 'journal'
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-zinc-800 hover:bg-zinc-700'
        }`"
        @click="toggleViewMode('journal')"
      >
        <CloudIcon class="size-6" />
      </button>
    </div>

    <div class="flex gap-2">
      <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 self-end" @click="toggleDarkMode">
        <MoonIcon v-if="globalStore.darkMode" class="text-white size-6" />
        <SunIcon v-else class="text-white size-6" />
      </button>

      <button
        class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 disabled:opacity-60 disabled:hover:bg-zinc-800"
        :disabled="globalStore.currentTimetableData == null"
        @click="openPrintingWindow"
      >
        <PrinterIcon class="text-white size-6" />
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
        <ArrowDownTrayIcon class="text-white size-6" />
      </button>
    </div>

    <!-- Active Data Search -->
    <select
      name="trains"
      id="trains-select"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :disabled="apiStore.activeDataStatus != DataStatus.SUCCESS"
      v-model="globalStore.selectedTrainId"
      v-if="globalStore.viewMode == 'active'"
      @change="selectTrain"
    >
      <option :value="null" disabled>
        {{
          apiStore.activeDataStatus == DataStatus.LOADING
            ? $t('data-loading-text')
            : $t('train-select-placeholder')
        }}
      </option>
      <option :value="train.id" v-for="train in globalStore.activeTimetableTrains">
        {{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }} [{{
          getRegionNameById(train.region)
        }}]
      </option>
    </select>

    <!-- Local Storage Search -->
    <input
      type="text"
      v-if="globalStore.viewMode == 'storage'"
      v-model="globalStore.localTimetableSearch"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :placeholder="$t('train-search-placeholder')"
    />

    <!-- Journal Serach -->
    <input
      type="text"
      v-else-if="globalStore.viewMode == 'journal'"
      @change="fetchJournalTimetables"
      v-model="globalStore.journalTimetableSearch"
      :class="`bg-zinc-800 p-1 rounded-md print:hidden w-full ${
        apiStore.connectionMode == 'offline' ? 'opacity-35' : ''
      }`"
      :disabled="
        apiStore.journalDataStatus == DataStatus.LOADING || apiStore.connectionMode == 'offline'
      "
      :placeholder="$t('journal-search-placeholder')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { DataStatus } from '../../types/api.types';
import { useGlobalStore } from '../../stores/global.store';
import {
  PrinterIcon,
  MoonIcon,
  SunIcon,
  ArchiveBoxArrowDownIcon,
  ArrowDownTrayIcon,
  CloudIcon,
  WifiIcon
} from '@heroicons/vue/16/solid';
import { getRegionNameById } from '../../utils/trainUtils';
import type { TimetableData, ViewMode } from '../../types/common.types';
import { watch } from 'vue';

// Stores
const apiStore = useApiStore();
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
function selectTrain() {
  if (!apiStore.activeData) return;

  globalStore.selectedActiveTrain =
    globalStore.activeTimetableTrains.find((train) => train.id == globalStore.selectedTrainId) ??
    null;
}

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

async function fetchJournalTimetables() {
  apiStore.fetchJournalTimetables(globalStore.journalTimetableSearch);
}
</script>
