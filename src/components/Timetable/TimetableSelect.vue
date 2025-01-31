<template>
  <div class="flex gap-2 mb-2">
    <button
      class="p-1 rounded-md"
      :class="{
        'bg-zinc-800 hover:bg-zinc-700': globalStore.viewMode == 'active',
        'bg-green-500 hover:bg-green-400': globalStore.viewMode == 'storage',
      }"
      @click="toggleViewMode"
    >
      <ArchiveBoxArrowDownIcon class="size-6" />
    </button>

    <select
      name="trains"
      id="trains-select"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :disabled="apiStore.activeDataStatus != DataStatus.SUCCESS"
      v-model="selectedTrainId"
      v-if="globalStore.viewMode == 'active'"
      @change="selectTrain"
    >
      <option :value="null" disabled>
        {{ apiStore.activeDataStatus == DataStatus.LOADING ? $t('data-loading-text') : $t('train-select-placeholder') }}
      </option>
      <option :value="train.id" v-for="train in globalStore.activeTimetableTrains">
        {{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }} [{{ getRegionNameById(train.region) }}]
      </option>
    </select>

    <input
      type="text"
      v-if="globalStore.viewMode == 'storage'"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :placeholder="$t('train-select-placeholder')"
    />

    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="toggleDarkMode">
      <MoonIcon v-if="globalStore.darkMode" class="text-white size-6" />
      <SunIcon v-else class="text-white size-6" />
    </button>

    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="openPrintingWindow">
      <PrinterIcon class="text-white size-6" />
    </button>

    <button
      class="p-1 rounded-md"
      :class="{
        'bg-green-600 hover:bg-green-700': isTimetableSaved,
        'bg-zinc-800 hover:bg-zinc-700': !isTimetableSaved,
      }"
      @click="saveToStorage"
    >
      <ArrowDownTrayIcon class="text-white size-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { DataStatus } from '../../types/api.types';
import { useGlobalStore } from '../../stores/global.store';
import { PrinterIcon, MoonIcon, SunIcon, ArchiveBoxArrowDownIcon, ArrowDownTrayIcon } from '@heroicons/vue/16/solid';
import { getRegionNameById } from '../../utils/trainUtils';
import type { TimetableData } from '../../types/common.types';

// Stores
const apiStore = useApiStore();
const globalStore = useGlobalStore();

// Variables & refs
let selectedTrainId = ref(null) as Ref<string | null>;

// Computed
const isTimetableSaved = computed(() => {
  if (!globalStore.currentTimetableData) return false;

  return Object.keys(globalStore.storageTimetables).includes(`${globalStore.currentTimetableData.timetableId}`);
});

// Methods
function selectTrain() {
  if (!apiStore.activeData) return;

  globalStore.selectedActiveTrain = globalStore.activeTimetableTrains.find((train) => train.id == selectedTrainId.value) ?? null;

  if (globalStore.selectedActiveTrain != null) {
    globalStore.generatedDate = new Date();
  }
}

function toggleViewMode() {
  globalStore.viewMode = globalStore.viewMode == 'active' ? 'storage' : 'active';
}

function toggleDarkMode() {
  globalStore.darkMode = !globalStore.darkMode;

  window.localStorage.setItem('currentTheme', globalStore.darkMode ? 'dark' : 'light');
}

function saveToStorage() {
  if (globalStore.currentTimetableData == null) return;

  try {
    const savedTimetablesStorage = localStorage.getItem('savedTimetables');
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage ? JSON.parse(savedTimetablesStorage) : {};
    savedTimetablesJSON[globalStore.currentTimetableData.timetableId] = { ...globalStore.currentTimetableData, savedTimestamp: Date.now() };

    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetablesJSON));
    globalStore.storageTimetables = savedTimetablesJSON;
  } catch (error) {}
}

function openPrintingWindow() {
  if (globalStore.selectedActiveTrain != null) {
    const date = `${globalStore.generatedDate!.toLocaleDateString('pl-PL').replace(/\./g, '-')}--${globalStore
      .generatedDate!.toLocaleTimeString('pl-PL')
      .replace(/:/g, '-')}`;

    document.title = `${globalStore.selectedActiveTrain.driverName} ; ${globalStore.selectedActiveTrain.timetable!.category} ${
      globalStore.selectedActiveTrain.trainNo
    }
      ${globalStore.selectedActiveTrain.timetable?.route.replace('|', ' - ')} ; ${date}`;
  }

  window.print();
}

// function refreshData() {
//   apiStore.fetchActiveData();
//   selectTrain();
// }
</script>
