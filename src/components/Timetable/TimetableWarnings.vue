<template>
  <!-- Local  -->
  <div class="print:hidden" v-if="globalStore.currentTimetableData?.savedTimestamp">
    <div class="flex gap-2 mt-1">
      <div class="flex items-center gap-2 bg-zinc-900 p-1 w-full">
        <div>
          <InfoIcon :size="20" />
        </div>
        <i18n-t keypath="storage-preview-info" tag="span">
          <template v-slot:id>
            <b>#{{ globalStore.currentTimetableData.timetableId }}</b>
          </template>
          <template v-slot:driverName>
            <b>{{ globalStore.currentTimetableData.driverName }}</b>
          </template>
          <template v-slot:date>
            <b>{{
              new Date(
                globalStore.currentTimetableData?.journalCreatedAt ??
                  globalStore.currentTimetableData.savedTimestamp
              ).toLocaleString()
            }}</b>
          </template>
        </i18n-t>
      </div>

      <button
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800 rounded-md"
        @click="removeTimetable(globalStore.currentTimetableData.timetableId)"
      >
        <Trash2Icon />
      </button>

      <button
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800 rounded-md"
        @click="globalStore.selectedStorageTimetable = null"
      >
        <Undo2Icon />
      </button>
    </div>
  </div>

  <!-- Journal -->
  <div class="print:hidden" v-else-if="globalStore.currentTimetableData?.journalCreatedAt">
    <div class="flex gap-2 mt-1">
      <div class="flex items-center gap-2 bg-zinc-900 p-1 w-full">
        <div>
          <InfoIcon :size="20" />
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
        class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800 rounded-md"
        @click="globalStore.selectedJournalTimetable = null"
      >
        <Undo2Icon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import { useI18n } from 'vue-i18n';
import type { TimetableData } from '../../types/common.types';
import { InfoIcon, Trash2Icon, Undo2Icon } from 'lucide-vue-next';

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
