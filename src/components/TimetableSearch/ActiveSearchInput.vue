<template>
  <select
    v-model="globalStore.selectedTrainId"
    @change="selectTrain"
    name="trains"
    id="trains-select"
    class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
    :disabled="apiStore.activeDataStatus != DataStatus.SUCCESS"
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
</template>

<script setup lang="ts">
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import { DataStatus } from '../../types/api.types';
import { getRegionNameById } from '../../utils/trainUtils';

const apiStore = useApiStore();
const globalStore = useGlobalStore();

function selectTrain() {
  if (!apiStore.activeData) return;

  globalStore.selectedActiveTrain =
    globalStore.activeTimetableTrains.find((train) => train.id == globalStore.selectedTrainId) ??
    null;
}
</script>
