<template>
  <!-- Timetable render based on current view mode -->
  <CurrentTimetableView v-if="globalStore.currentTimetableData != null" />

  <!-- If there is no timetable chosen -->
  <div class="overflow-auto text-center font-bold text-zinc-400 p-1 min-h-full" v-else>
    <component :is="viewModes[globalStore.viewMode]" />
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global.store';
import LocalStorageView from '../TimetableViews/LocalStorageView.vue';
import JournalStorageView from '../TimetableViews/JournalStorageView.vue';
import ActiveDataView from '../TimetableViews/ActiveDataView.vue';
import CurrentTimetableView from '../TimetableViews/CurrentTimetableView.vue';

const globalStore = useGlobalStore();

const viewModes: Record<typeof globalStore.viewMode, any> = {
  active: ActiveDataView,
  storage: LocalStorageView,
  journal: JournalStorageView
};
</script>
