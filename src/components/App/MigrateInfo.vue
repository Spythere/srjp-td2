<template>
  <div class="fixed z-10 bottom-0 left-0 p-1 text-center w-full bg-yellow-400 text-black font-bold">
    <div class="flex justify-center items-center flex-wrap gap-2">
      <i18n-t keypath="migrate-info.line-1" for="migrate-info" tag="div">
        <a href="https://srjp-td2.spythere.eu/" target="_blank" class="underline">
          https://srjp-td2.spythere.eu/
        </a>
      </i18n-t>
      <button
        class="p-1 bg-zinc-700 text-white rounded-md hover:bg-zinc-500 focus-visible:bg-zinc-500"
        @click="onAcceptButtonClick"
      >
        {{ t('migrate-info.accept-btn') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global.store';

const store = useGlobalStore();
const { t } = useI18n();

function onAcceptButtonClick() {
  store.isMigrationInfoOpen = false;
  localStorage.setItem('showMigrationInfo', 'false');
}
</script>
