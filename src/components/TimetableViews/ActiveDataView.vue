<template>
  <div>
    <div v-if="apiStore.connectionMode == 'online'">{{ $t('train-select-info') }}</div>
    <div v-else class="bg-red-500 text-white p-2">{{ $t('data-offline-mode') }}</div>
  </div>
</template>

<script setup lang="ts">
import { useApiStore } from '../../stores/api.store';

const apiStore = useApiStore();
</script>
