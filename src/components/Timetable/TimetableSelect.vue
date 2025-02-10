<template>
  <div class="flex gap-2 mb-2">
    <div class="relative" @focusin="isMenuOpen = true" @keydown.esc="isMenuOpen = false">
      <button
        class="p-1 rounded-md flex gap-2"
        :class="{
          'bg-zinc-800 hover:bg-zinc-700': isMenuOpen == false,
          'bg-green-600 hover:bg-green-500': isMenuOpen == true,
        }"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Bars3Icon class="size-6" />
      </button>

      <div class="fixed z-20 left-0 top-0 w-screen h-screen" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

      <div class="absolute z-30 top-full left-0 w-36 p-1 mt-2 flex flex-col gap-1 bg-zinc-600 rounded-md" v-if="isMenuOpen">
        <button
          class="p-1 rounded-md flex gap-2"
          :class="{
            'bg-zinc-950 hover:bg-zinc-800': globalStore.viewMode != 'active',
            'bg-green-600 hover:bg-green-500': globalStore.viewMode == 'active',
          }"
          @click="toggleViewMode('active')"
        >
          <WifiIcon class="size-6" /> <span> Aktywne RJ</span>
        </button>

        <button
          class="p-1 rounded-md flex gap-2"
          :class="{
            'bg-zinc-950 hover:bg-zinc-800': globalStore.viewMode != 'storage',
            'bg-green-600 hover:bg-green-500': globalStore.viewMode == 'storage',
          }"
          @click="toggleViewMode('storage')"
        >
          <ArchiveBoxArrowDownIcon class="size-6" /> Zapisane RJ
        </button>

        <button
          class="p-1 rounded-md flex gap-2"
          :class="{
            'bg-zinc-950 hover:bg-zinc-800': globalStore.viewMode != 'journal',
            'bg-green-600 hover:bg-green-500': globalStore.viewMode == 'journal',
          }"
          @click="toggleViewMode('journal')"
        >
          <CloudArrowDownIcon class="size-6" /> Dziennik RJ
        </button>

        <!-- <button class="m-0 p-0" @focus="isMenuOpen = false"></button> -->
      </div>
    </div>

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
        {{ apiStore.activeDataStatus == DataStatus.LOADING ? $t('data-loading-text') : $t('train-select-placeholder') }}
      </option>
      <option :value="train.id" v-for="train in globalStore.activeTimetableTrains">
        {{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }} [{{ getRegionNameById(train.region) }}]
      </option>
    </select>

    <input
      type="text"
      v-if="globalStore.viewMode == 'storage'"
      v-model="globalStore.storageTimetableSearch"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :placeholder="$t('train-search-placeholder')"
    />

    <div v-if="globalStore.viewMode == 'journal'" class="w-full relative">
      <input
        type="text"
        v-model="globalStore.journalTimetableSearch"
        class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
        :placeholder="$t('journal-search-placeholder')"
        @keydown.enter="fetchJournalTrain"
      />

      <div class="absolute top-0 right-0">
        <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700">
          <MagnifyingGlassIcon class="text-white size-6" />
        </button>

        <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700">
          <XMarkIcon class="text-white size-6" />
        </button>
      </div>
    </div>

    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="toggleDarkMode">
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
        'bg-zinc-800 hover:bg-zinc-700': !isTimetableSaved,
      }"
      @click="saveToStorage"
    >
      <ArrowDownTrayIcon class="text-white size-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { DataStatus } from '../../types/api.types';
import { useGlobalStore } from '../../stores/global.store';
import {
  PrinterIcon,
  MoonIcon,
  SunIcon,
  ArchiveBoxArrowDownIcon,
  ArrowDownTrayIcon,
  CloudArrowDownIcon,
  WifiIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from '@heroicons/vue/16/solid';
import { getRegionNameById } from '../../utils/trainUtils';
import type { TimetableData, ViewMode } from '../../types/common.types';

// Stores
const apiStore = useApiStore();
const globalStore = useGlobalStore();

const isMenuOpen = ref(false);

// Computed
const isTimetableSaved = computed(() => {
  if (!globalStore.currentTimetableData) return false;

  return Object.keys(globalStore.storageTimetables).includes(`${globalStore.currentTimetableData.timetableId}`);
});

// Methods
function selectTrain() {
  if (!apiStore.activeData) return;

  globalStore.selectedActiveTrain = globalStore.activeTimetableTrains.find((train) => train.id == globalStore.selectedTrainId) ?? null;

  if (globalStore.selectedActiveTrain != null) {
    globalStore.generatedDate = new Date();
  }
}

function fetchJournalTrain(e: Event) {
  e.preventDefault();

  console.log(globalStore.journalTimetableSearch);
}

function toggleViewMode(viewMode: ViewMode) {
  if (viewMode == globalStore.viewMode) {
    switch (viewMode) {
      case 'active':
        globalStore.selectedActiveTrain = null;
        break;

      case 'storage':
        globalStore.selectedStorageTimetable = null;
        break;

      case 'journal':
        globalStore.selectedJournalTimetable = null;
        break;

      default:
        break;
    }
  }

  isMenuOpen.value = false;
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
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage ? JSON.parse(savedTimetablesStorage) : {};

    if (savedTimetablesJSON[globalStore.currentTimetableData.timetableId] !== undefined) {
      globalStore.selectedStorageTimetable = savedTimetablesJSON[globalStore.currentTimetableData.timetableId];
      globalStore.viewMode = 'storage';

      return;
    }

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
