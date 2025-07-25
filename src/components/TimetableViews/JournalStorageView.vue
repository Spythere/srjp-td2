<template>
  <div class="text-white">
    <h2 class="font-bold p-2 bg-zinc-700 mb-3 text-2xl flex items-center gap-2 justify-center flex-wrap">
      <HistoryIcon :size="25" />
      {{ $t('journal-preview-title') }}
    </h2>

    <div v-if="apiStore.connectionMode == 'offline'" class="bg-red-500 p-2">
      {{ $t('data-offline-mode') }}
    </div>

    <div v-else-if="apiStore.journalDataStatus == DataStatus.LOADING" class="bg-zinc-900 p-2">
      {{ $t('data-loading-text') }}
    </div>

    <div v-else-if="apiStore.journalDataStatus == DataStatus.ERROR" class="bg-red-500 p-2">
      {{ $t('data-loading-error-text') }}
    </div>

    <div
      v-else-if="!apiStore.journalTimetablesData"
      class="text-zinc-400 mt-2"
      v-html="$t('journal-empty-info')"
    ></div>

    <div v-else-if="apiStore.journalTimetablesData.length == 0">
      <p class="text-zinc-300 mb-2">
        {{ $t('journal-no-data') }}
      </p>

      <b class="text-red-300">
        {{ $t('journal-reminder-text') }}
      </b>
    </div>

    <div v-else>
      <ul>
        <li
          v-for="timetable in apiStore.journalTimetablesData"
          class="flex gap-1 w-full my-2"
          @click="fetchTimetableDetails(timetable.id)"
        >
          <button class="bg-zinc-900 p-2 w-full cursor-pointer hover:bg-zinc-800 text-left">
            <div class="text-zinc-300">
              #{{ timetable.id }} &bull;
              {{ new Date(timetable.createdAt!).toLocaleString() }}
            </div>
            <b>
              {{ timetable.driverName }} | {{ timetable.trainCategoryCode }}
              {{ timetable.trainNo }}
            </b>
            {{ timetable.route.replace('|', ' > ') }}
          </button>
        </li>
      </ul>

      <div v-if="apiStore.journalTimetablesData.length > 0">
        <hr class="border-t-2 border-t-gray-500" />

        <p class="text-zinc-400 text-sm">
          {{ $t('journal-footer-text') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HistoryIcon } from 'lucide-vue-next';
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import { DataStatus } from '../../types/api.types';
import type { JournalTimetableDetailed } from '../../types/common.types';

const apiStore = useApiStore();
const globalStore = useGlobalStore();

async function fetchTimetableDetails(id: number) {
  try {
    const response = (
      await apiStore.client!.get<JournalTimetableDetailed[]>('/api/getTimetables', {
        params: {
          timetableId: id,
          hasStopsDetails: 1,
          returnType: 'detailed'
        }
      })
    ).data;

    if (response.length > 0) globalStore.selectedJournalTimetable = response[0];
  } catch (error) {
    globalStore.selectedJournalTimetable = null;
    console.error(error);
  }
}
</script>
