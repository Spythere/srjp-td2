<template>
  <main class="grid print:block p-3 mx-auto max-w-[800px] h-[calc(100vh-40px)] min-h-[300px] grid-rows-[auto_auto_1fr] gap-1">
    <SearchContainer />
    <TimetableWarnings />
    <TrainTimetable />
  </main>
</template>

<script setup lang="ts">
import TimetableWarnings from "../Timetable/TimetableWarnings.vue";
import TrainTimetable from '../Timetable/TrainTimetable.vue';
import SearchContainer from "../TimetableSearch/SearchContainer.vue";
</script>
