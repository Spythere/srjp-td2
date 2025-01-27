<template>
  <div class="overflow-auto py-1">
    <b v-if="globalStore.selectedTrain" class="my-2">
      {{ globalStore.selectedTrain.timetable!.category }} {{ globalStore.selectedTrain.trainNo }} Relacja
      {{ globalStore.selectedTrain.timetable?.route.replace('|', ' - ') }}
    </b>

    <table class="table-fixed mt-2 w-full border-collapse">
      <TimetableHeader />
      <TimetableBody />
    </table>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import TimetableBody from './TimetableBody.vue';
import TimetableHeader from './TimetableHeader.vue';

const globalStore = useGlobalStore();
</script>