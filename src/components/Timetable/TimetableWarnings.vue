<template>
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

      <button class="font-bold bg-zinc-900 p-1 hover:bg-zinc-800" @click="globalStore.selectedStorageTimetable = null">
        <ArrowUturnLeftIcon class="text-white size-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUturnLeftIcon, InformationCircleIcon } from '@heroicons/vue/16/solid';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();
</script>
