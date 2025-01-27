<template>
  <main class="grid print:block p-3 mx-auto max-w-[800px] h-screen grid-rows-[auto_1fr_20px] gap-1">
    <TimetableSelect />
    <TrainTimetable />
    <MainBottom />
  </main>
</template>

<script setup lang="ts">
import TimetableSelect from '../Timetable/TimetableSelect.vue';
import TrainTimetable from '../Timetable/TrainTimetable.vue';
import MainBottom from './MainBottom.vue';
</script>
