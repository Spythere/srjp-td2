<template>
  <div class="flex gap-2" v-if="globalStore.currentTimetableData == null">
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
        <Trash2Icon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next';
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();

function clearSearch() {
  globalStore.localTimetableSearch = '';
}
</script>
