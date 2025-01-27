<template>
  <nav class="bg-zinc-900 w-full p-1 print:hidden flex justify-between items-center">
    <div class="flex items-center">
      <img src="/favicon.svg" class="size-8 inline" />
      <b class="ml-2 text-lg"
        >Rozkładownik TD2 <sup class="font-semibold text-zinc-300">{{ version }}</sup></b
      >
    </div>
    <div v-if="apiMode == 'mocking'"><ExclamationTriangleIcon class="size-6 inline mr-1 text-yellow-400" /> API mocking</div>
  </nav>
</template>

<script setup lang="ts">
import { version } from '../../../package.json';
import { ExclamationTriangleIcon } from '@heroicons/vue/16/solid';

const apiMode = import.meta.env.VITE_API_MODE;
</script>
