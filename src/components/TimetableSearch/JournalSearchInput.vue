<template>
  <div class="flex gap-2 items-center">
    <div class="flex gap-2 w-full">
      <input
        v-model="globalStore.journalTimetableSearch.driverName"
        type="text"
        @keydown.enter="fetchJournalTimetables"
        :class="`bg-zinc-800 p-1 rounded-md print:hidden w-full ${
          apiStore.connectionMode == 'offline' ? 'opacity-35' : ''
        }`"
        :disabled="
          apiStore.journalDataStatus == DataStatus.LOADING || apiStore.connectionMode == 'offline'
        "
        :placeholder="$t('journal-driver-search-placeholder')"
      />

      <input
        v-model="globalStore.journalTimetableSearch.route"
        type="text"
        @keydown.enter="fetchJournalTimetables"
        :class="`bg-zinc-800 p-1 rounded-md print:hidden w-full ${
          apiStore.connectionMode == 'offline' ? 'opacity-35' : ''
        }`"
        :disabled="
          apiStore.journalDataStatus == DataStatus.LOADING || apiStore.connectionMode == 'offline'
        "
        :placeholder="$t('journal-route-search-placeholder')"
      />

      <input
        v-model="globalStore.journalTimetableSearch.date"
        type="date"
        @keydown.enter="fetchJournalTimetables"
        :class="`bg-zinc-800 p-1 rounded-md print:hidden w-full ${
          apiStore.connectionMode == 'offline' ? 'opacity-35' : ''
        }`"
        :disabled="
          apiStore.journalDataStatus == DataStatus.LOADING || apiStore.connectionMode == 'offline'
        "
        :placeholder="$t('journal-date-search-placeholder')"
      />
    </div>

    <button
      class="bg-zinc-800 hover:bg-zinc-700 p-1 rounded-md"
      v-if="globalStore.viewMode == 'journal'"
      @click="clearSearch"
    >
      <TrashIcon class="size-6" />
    </button>

    <button
      class="bg-zinc-800 hover:bg-zinc-700 p-1 rounded-md"
      v-if="globalStore.viewMode == 'journal'"
      @click="fetchJournalTimetables"
    >
      <ArrowRightCircleIcon class="size-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightCircleIcon, TrashIcon } from '@heroicons/vue/16/solid';
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import { DataStatus, type JournalTimetablesShortResponse } from '../../types/api.types';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

async function fetchJournalTimetables() {
  const searchValues = globalStore.journalTimetableSearch;

  let fetchParams: Record<string, any> = {};

  if (searchValues['driverName']) {
    fetchParams['driverName'] = searchValues['driverName'].trim();
  }

  if (searchValues['date']) {
    let dateFromStr = new Date(searchValues['date']).toISOString();

    let dateTo = new Date(dateFromStr);
    dateTo.setDate(dateTo.getDate() + 1);

    fetchParams['dateFrom'] = dateFromStr;
    fetchParams['dateTo'] = dateTo.toISOString();
  }

  if (searchValues['route']) {
    const [routeFrom, routeTo] = searchValues['route'].split('-');

    if (routeFrom) {
      fetchParams['issuedFrom'] = routeFrom.trim();
    }

    if (routeTo) {
      fetchParams['terminatingAt'] = routeTo.trim();
    }
  }

  fetchParams['hasStopsDetails'] = 1;
  fetchParams['returnType'] = 'short';

  try {
    apiStore.journalDataStatus = DataStatus.LOADING;

    const response = (
      await apiStore.client!.get<JournalTimetablesShortResponse>('/api/getTimetables', {
        params: fetchParams
      })
    ).data;

    apiStore.journalDataStatus = DataStatus.SUCCESS;
    apiStore.journalTimetablesData = response;
  } catch (error) {
    apiStore.journalDataStatus = DataStatus.ERROR;
    apiStore.journalTimetablesData = null;
    console.error(error);
  }
}

function clearSearch() {
  Object.keys(globalStore.journalTimetableSearch).forEach(
    (k) => ((globalStore.journalTimetableSearch as any)[k] = '')
  );

  apiStore.journalTimetablesData = null;
}
</script>
