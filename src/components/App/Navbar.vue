<template>
  <nav class="bg-zinc-900 w-full p-1 print:hidden flex justify-between items-center relative">
    <div class="flex items-center">
      <img src="/favicon.svg" class="size-8 inline" />
      <b class="ml-2 text-lg"
        >Rozkładownik TD2 <sup class="font-semibold text-zinc-300">{{ version }}</sup></b
      >
    </div>

    <div>
      <button class="bg-slate-600 p-1 px-2 rounded-md hover:bg-slate-500 flex items-center" @click="changeLang()">
        <LanguageIcon class="size-5 inline-block align-middle mr-2" /> {{ i18n.locale.value == 'pl' ? 'POL' : 'ENG' }}
      </button>
    </div>
    <!-- <div v-if="apiMode == 'mocking'"><ExclamationTriangleIcon class="size-6 inline mr-1 text-yellow-400" /> API mocking</div> -->
  </nav>
</template>

<script setup lang="ts">
import { LanguageIcon } from '@heroicons/vue/16/solid';
import { version } from '../../../package.json';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

function changeLang(locale?: string) {
  i18n.locale.value = locale ?? i18n.locale.value == 'pl' ? 'en' : 'pl';
  window.localStorage.setItem('locale', i18n.locale.value);
}
// const apiMode = import.meta.env.VITE_API_MODE;
</script>
