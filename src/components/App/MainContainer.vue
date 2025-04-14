<template>
  <main class="grid print:block p-3 mx-auto max-w-[800px] h-[calc(100vh-40px)] min-h-[300px] grid-rows-[auto_auto_1fr] gap-1">
    <TimetableSelect />
    <TimetableWarnings />
    <TrainTimetable />
  </main>
</template>

<script setup lang="ts">
import TimetableSelect from '../Timetable/TimetableSelect.vue';
import TimetableWarnings from "../Timetable/TimetableWarnings.vue";
import TrainTimetable from '../Timetable/TrainTimetable.vue';
</script>
