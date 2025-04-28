<template>
  <div class="flex gap-2">
    <div class="w-full">
      <input
        v-model="globalStore.localTimetableSearch"
        type="text"
        class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
        :placeholder="$t('train-search-placeholder')"
      />
    </div>

    <div>
      <button
        class="bg-zinc-800 hover:bg-zinc-700 p-1 rounded-md"
        v-if="globalStore.viewMode == 'storage'"
        @click="clearSearch"
      >
        <TrashIcon class="size-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/16/solid';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();

function clearSearch() {
  globalStore.localTimetableSearch = '';
}
</script>
