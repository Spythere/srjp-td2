<template>
  <div class="fixed top-0 left-0 w-screen h-screen z-10 bg-black bg-opacity-70" v-if="globalStore.showSettings" @click="globalStore.showSettings = false">
    <!-- <div class="fixed top-0 left-0 w-screen h-screen z-10" v-show="showSettings" @click="showSettings = false"></div> -->

    <!-- <div class="absolute mt-2 top-full right-0 p-1 rounded-md bg-slate-600 w-full z-20 max-w-[250px]" v-show="showSettings"></div> -->

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-zinc-800 p-2 h-[500px] z-20">
      <div class="grid grid-cols-2 gap-2">
        <button
          class="bg-slate-900 p-1 rounded-md hover:bg-slate-800"
          :class="{ 'font-bold text-yellow-400': i18n.locale.value == 'pl' }"
          @click="chooseLang('pl')"
        >
          POLSKI
        </button>
        <button
          class="bg-slate-900 p-1 rounded-md hover:bg-slate-800"
          :class="{ 'font-bold text-yellow-400': i18n.locale.value == 'en' }"
          @click="chooseLang('en')"
        >
          ENGLISH
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global.store';

const i18n = useI18n();
const globalStore = useGlobalStore();

function chooseLang(locale: string) {
  i18n.locale.value = locale;
  window.localStorage.setItem('locale', i18n.locale.value);
  globalStore.showSettings = false;
}
</script>

<style scoped></style>
