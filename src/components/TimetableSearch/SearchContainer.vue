<template>
  <div class="flex gap-2 flex-col print:hidden">
    <!-- Top Actions & Modes -->
    <SearchModeActions />

    <!-- Active Data Search -->
    <ActiveSearchInput v-if="globalStore.viewMode == 'active'" />

    <!-- Local Storage Search -->
    <LocalSearchInput v-else-if="globalStore.viewMode == 'storage'" />

    <!-- Journal Serach -->
    <JournalSearchInput v-else />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';

import ActiveSearchInput from './ActiveSearchInput.vue';
import JournalSearchInput from './JournalSearchInput.vue';
import LocalSearchInput from './LocalSearchInput.vue';
import SearchModeActions from './SearchModeActions.vue';

const globalStore = useGlobalStore();
</script>
