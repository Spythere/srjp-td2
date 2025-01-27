<template>
  <div class="flex gap-2 mb-2">
    <select
      name="trains"
      id="trains-select"
      class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
      :disabled="apiStore.activeDataStatus != DataStatus.SUCCESS"
      v-model="selectedTrainId"
      @change="selectTrain"
    >
      <option :value="null" disabled>{{ apiStore.activeDataStatus == DataStatus.LOADING ? 'Ładowanie danych...' : 'Wybierz pociąg z listy' }}</option>
      <option :value="train.id" v-for="train in globalStore.activeTimetableTrains">
        {{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }} [{{ getRegionNameById(train.region) }}]
      </option>
    </select>

    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="openPrintingWindow">
      <PrinterIcon class="text-white size-6" />
    </button>

    <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 relative" @click="refreshData">
      <ArrowPathIcon class="text-white size-6" />
      <div v-if="apiStore.isActiveDataOutdated" class="size-3 bg-green-300 rounded-full absolute -top-1 -right-1"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { DataStatus } from '../../types/api.types';
import { useGlobalStore } from '../../stores/global.store';
import { PrinterIcon, ArrowPathIcon } from '@heroicons/vue/16/solid';
import { getRegionNameById } from '../../utils/trainUtils';

// Stores
const apiStore = useApiStore();
const globalStore = useGlobalStore();

// Variables & refs
let selectedTrainId = ref(null) as Ref<string | null>;

// Methods
function selectTrain() {
  if (!apiStore.activeData) return;

  globalStore.selectedTrain = globalStore.activeTimetableTrains.find((train) => train.id == selectedTrainId.value) ?? null;

  if (globalStore.selectedTrain != null) globalStore.generatedDate = new Date();
}

function openPrintingWindow() {
  window.print();
}

function refreshData() {
  apiStore.fetchActiveData();
  selectTrain();
}
</script>
