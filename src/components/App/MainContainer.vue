<template>
  <main class="grid print:block p-3 mx-auto max-w-[800px] h-screen grid-rows-[auto_auto_1fr] gap-1">
    <TimetableSelect />
    <TimetableWarnings />
    <TrainTimetable />
    <!-- <MainBottom /> -->
  </main>
</template>

<script setup lang="ts">
import TimetableSelect from '../Timetable/TimetableSelect.vue';
import TimetableWarnings from "../Timetable/TimetableWarnings.vue";
import TrainTimetable from '../Timetable/TrainTimetable.vue';
// import MainBottom from './MainBottom.vue';
</script>
