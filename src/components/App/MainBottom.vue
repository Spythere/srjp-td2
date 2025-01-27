<template>
  <div v-if="globalStore.generatedDate" class="text-center text-sm text-zinc-400 mt-1 print:hidden">
    Rozkład wygenerowany w
    {{
      globalStore.generatedMs
    }}ms - aktualny dla godziny:
    {{
      globalStore.generatedDate.toLocaleTimeString()
    }}
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';

const globalStore = useGlobalStore();
</script>
