<template>
  <div
    class="my-2 print:hidden"
    v-if="globalStore.currentTimetableData && (globalStore.timetableWarnings || globalStore.currentTimetableData.savedTimestamp)"
  >
    <div v-if="globalStore.currentTimetableData?.savedTimestamp" class="flex justify-between p-1 bg-zinc-900">
      <div>
        {{ $t('storage-preview-text') }}
        <b>#{{ globalStore.currentTimetableData.timetableId }}</b>
      </div>

      <button class="font-bold" @click="globalStore.selectedStorageTimetable = null">
        <ArrowUturnLeftIcon class="text-white size-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUturnLeftIcon } from '@heroicons/vue/16/solid';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();
</script>
