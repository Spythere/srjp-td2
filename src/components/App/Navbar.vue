<template>
  <nav class="bg-zinc-900 w-full p-1 print:hidden flex justify-between items-center relative">
    <div class="flex items-center">
      <img src="/favicon.svg" class="size-8 inline" alt="SRJP logo" />
      <b class="ml-2 text-lg">
        Rozkładownik TD2
        <sup class="font-semibold text-zinc-300">
          <a :href="releaseHref" target="_blank">v{{ version }}</a>
        </sup>
      </b>
    </div>

    <div>
      <button
        class="bg-slate-600 p-1 px-2 rounded-md hover:bg-slate-500 flex items-center"
        @click="changeLang()"
      >
        <GlobeIcon :size="18" class="mr-2" /> {{ i18n.locale.value == 'pl' ? 'POL' : 'ENG' }}
      </button>
    </div>
    <!-- <div v-if="apiMode == 'mocking'"><ExclamationTriangleIcon class="size-6 inline mr-1 text-yellow-400" /> API mocking</div> -->
  </nav>
</template>

<script setup lang="ts">
import { GlobeIcon } from 'lucide-vue-next';
import { version } from '../../../package.json';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const i18n = useI18n();

function changeLang(locale?: string) {
  i18n.locale.value = (locale ?? i18n.locale.value == 'pl') ? 'en' : 'pl';
  window.localStorage.setItem('locale', i18n.locale.value);
}

const releaseHref = computed(() => `https://github.com/Spythere/srjp-td2/releases/tag/v${version}`);
// const apiMode = import.meta.env.VITE_API_MODE;
</script>
