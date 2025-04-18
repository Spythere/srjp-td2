<template>
  <div class="text-white">
    <div v-if="globalStore.selectedStorageTimetable == null && Object.keys(globalStore.storageTimetables).length == 0">
      <div class="font-bold text-xl">{{ $t('storage-empty-header') }}</div>
      <div>{{ $t('storage-empty-info') }}</div>
    </div>

    <div v-else>
      <div class="font-bold p-2 bg-zinc-700 mb-3">
        <div class="text-2xl">{{ $t('storage-preview-title') }}</div>
        <div class="flex gap-2 justify-center">
          <template v-for="(mode, i) in storageModeList">
            <span v-if="i != 0">&bull;</span>
            <button class="hover:text-green-300" :class="{ 'underline text-green-300': currentStorageModeIndex == i }" @click="selectStorageMode(i)">
              {{ $t(`storage-mode.${mode.key}`) }}
            </button>
          </template>
        </div>
      </div>

      <!-- Current storage mode component -->
      <component :is="storageModeList[currentStorageModeIndex].component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import { StorageMode } from '../../types/common.types';
import { ref, type Component, type Ref } from 'vue';
import LocalStorage from '../TimetableStorage/LocalStorage.vue';
import ApiStorage from '../TimetableStorage/ApiStorage.vue';

interface CurrentStorageMode {
  key: StorageMode;
  component: Component;
}

const globalStore = useGlobalStore();
const currentStorageModeIndex: Ref<number> = ref(0);

const storageModeList: CurrentStorageMode[] = [
  {
    key: StorageMode.LOCAL,
    component: LocalStorage,
  },
  {
    key: StorageMode.API,
    component: ApiStorage,
  },
];

function selectStorageMode(index: number) {
  currentStorageModeIndex.value = index;
}
</script>
