<template>
  <!-- Local  -->
  <div class="my-2 print:hidden" v-if="globalStore.currentTimetableData?.savedTimestamp">
    <div class="flex gap-2">
      <div class="flex items-center gap-2 bg-zinc-900 p-1 w-full">
        <div>
          <InformationCircleIcon class="size-5" />
        </div>
        <i18n-t keypath="storage-preview-info" tag="span">
          <template v-slot:id>
            <b>#{{ globalStore.currentTimetableData.timetableId }}</b>
          </template>
          <template v-slot:driverName>
            <b>{{ globalStore.currentTimetableData.driverName }}</b>
          </template>
          <template v-slot:date>
            <b>{{ new Date(globalStore.currentTimetableData.savedTimestamp).toLocaleString() }}</b>
          </template>
        </i18n-t>
      </div>

      <button
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800"
        @click="removeTimetable(globalStore.currentTimetableData.timetableId)"
      >
        <TrashIcon class="text-white size-6" />
      </button>

      <button
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800"
        @click="globalStore.selectedStorageTimetable = null"
      >
        <ArrowUturnLeftIcon class="text-white size-6" />
      </button>
    </div>
  </div>

  <!-- Journal -->
  <div class="my-2 print:hidden" v-if="globalStore.currentTimetableData?.journalCreatedAt">
    <div class="flex gap-2">
      <div class="flex items-center gap-2 bg-zinc-900 p-1 w-full">
        <div>
          <InformationCircleIcon class="size-5" />
        </div>

        <i18n-t keypath="journal-preview-info" tag="span">
          <template v-slot:id>
            <b>#{{ globalStore.currentTimetableData.timetableId }}</b>
          </template>
          <template v-slot:driverName>
            <b>{{ globalStore.currentTimetableData.driverName }}</b>
          </template>
          <template v-slot:date>
            <b>{{
              new Date(globalStore.currentTimetableData.journalCreatedAt).toLocaleString()
            }}</b>
          </template>
        </i18n-t>
      </div>

      <button
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800"
        @click="globalStore.selectedJournalTimetable = null"
      >
        <ArrowUturnLeftIcon class="text-white size-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUturnLeftIcon, InformationCircleIcon, TrashIcon } from '@heroicons/vue/16/solid';
import { useGlobalStore } from '../../stores/global.store';
import { useI18n } from 'vue-i18n';
import type { TimetableData } from '../../types/common.types';

const globalStore = useGlobalStore();
const i18n = useI18n();

function removeTimetable(timetableId: number) {
  const isConfirmed = confirm(i18n.t('delete-timetable-confirm'));

  if (!isConfirmed) return;

  try {
    const savedTimetablesStorage = localStorage.getItem('savedTimetables');
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage
      ? JSON.parse(savedTimetablesStorage)
      : {};
    delete savedTimetablesJSON[timetableId];

    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetablesJSON));
    globalStore.storageTimetables = savedTimetablesJSON;

    globalStore.selectedStorageTimetable = null;
  } catch (error) {}
}
</script>
