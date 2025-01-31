<template>
  <div class="text-white">
    <div v-if="globalStore.selectedStorageTimetable == null && Object.keys(globalStore.storageTimetables).length == 0">
      <div class="font-bold text-xl">{{ $t('storage-empty-header') }}</div>
      <div>{{ $t('storage-empty-info') }}</div>
    </div>

    <div v-else>
      <div class="font-bold text-xl p-2 bg-zinc-700 mb-3">{{ $t('storage-preview-title') }}</div>
      <div class="font-bold p-2 bg-zinc-800 mb-3" v-if="filteredTimetables.length == 0">{{ $t('storage-preview-empty') }}</div>

      <transition-group class="relative" tag="ul" name="list">
        <li v-for="timetable in filteredTimetables" class="flex gap-1 w-full my-2">
          <button class="bg-zinc-900 p-2 w-full cursor-pointer hover:bg-zinc-800 text-left" @click="selectTimetable(timetable)">
            <div class="text-zinc-300">#{{ timetable.timetableId }} &bull; {{ new Date(timetable.savedTimestamp!).toLocaleString() }}</div>
            <b>{{ timetable.driverName }} | {{ timetable.category }} {{ timetable.trainNo }}</b> {{ timetable.route.replace('|', ' > ') }}
          </button>

          <button class="bg-zinc-900 p-2 hover:bg-zinc-800" @click="removeTimetable(timetable.timetableId)">
            <TrashIcon class="size-5 text-white" />
          </button>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/16/solid';
import { useGlobalStore } from '../../stores/global.store';
import type { TimetableData } from '../../types/common.types';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const globalStore = useGlobalStore();
const i18n = useI18n();

const filteredTimetables = computed(() => {
  const timetables = Object.values(globalStore.storageTimetables);

  if (globalStore.timetableSearch.length != 0)
    timetables.filter((st) =>
      `${st.timetableId} ${st.driverName} ${st.route} ${st.category} ${st.trainNo}`
        .toLocaleLowerCase()
        .includes(globalStore.timetableSearch.toLocaleLowerCase())
    );

  timetables.sort((a, b) => {
    return (b.savedTimestamp ?? 0) - (a.savedTimestamp ?? 0);
  });

  return timetables;
});

function selectTimetable(timetable: TimetableData) {
  globalStore.selectedStorageTimetable = timetable;
}

function removeTimetable(timetableId: number) {
  const isConfirmed = confirm(i18n.t('delete-timetable-confirm'));

  if (!isConfirmed) return;

  try {
    const savedTimetablesStorage = localStorage.getItem('savedTimetables');
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage ? JSON.parse(savedTimetablesStorage) : {};
    delete savedTimetablesJSON[timetableId];

    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetablesJSON));
    globalStore.storageTimetables = savedTimetablesJSON;
  } catch (error) {}
}
</script>

<style scoped></style>
