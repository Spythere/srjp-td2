<template>
  <div>
    <div v-if="globalStore.selectedStorageTimetable == null && Object.keys(globalStore.storageTimetables).length == 0">
      <div class="font-bold text-xl">{{ $t('storage-empty-header') }}</div>
      <div>{{ $t('storage-empty-info') }}</div>
    </div>

    <div v-else>
      <ul class="flex flex-col gap-3">
        <li v-for="timetable in globalStore.storageTimetables" class="text-left">
          <button class="bg-zinc-900 p-2 w-full text-zinc-300 cursor-pointer hover:bg-zinc-800" @click="selectTimetable(timetable)">
            <b>{{ timetable.driverName }} {{ timetable.category }} {{ timetable.trainNo }}</b> {{ timetable.route.replace('|', ' - ') }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import type { TimetableData } from '../../types/common.types';

const globalStore = useGlobalStore();

function selectTimetable(timetable: TimetableData) {
  globalStore.selectedStorageTimetable = timetable;
}
</script>

<style scoped></style>
