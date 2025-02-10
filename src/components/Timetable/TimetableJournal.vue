<template>
  <div class="text-white">
    <!-- <div v-if="apiStore.journalTimetables == null">
      <div class="font-bold text-xl">{{ $t('storage-empty-header') }}</div>
      <div>{{ $t('storage-empty-info') }}</div>
    </div> -->

    <div class="font-bold text-2xl p-2 bg-zinc-800">DZIENNIK SRJP</div>

    <div v-if="apiStore.journalTimetables == null" class="text-md mt-2 p-2 bg-zinc-900">
      Wyszukaj gracza w polu powyżej, aby pokazać jego najnowsze SRJP.
      <!-- <div class="text-sm text-red-400 mt-2 flex flex-wrap md:flex-nowrap justify-center items-center gap-1">
        <ExclamationCircleIcon class="size-8 min-w-8" />
        <span>
          Rozkłady z danymi do wygenerowania SRJP są dostępne tylko dla wspierających twórczość
          <a class="underline hover:text-red-200 transition-colors" href="https://td2.info.pl/profile/?u=20777" target="_blank">@Spythere</a> dla
          symulatora TD2!
        </span>
      </div> -->
    </div>

    <!-- <div class="font-bold text-xl p-2 bg-zinc-700 mb-3">{{ $t('storage-preview-title') }}</div> -->
    <!-- <div class="font-bold p-2 bg-zinc-800 mb-3" v-if="filteredTimetables.length == 0">{{ $t('storage-preview-empty') }}</div> -->

    <li v-for="timetable in apiStore.journalTimetables" class="flex gap-1 w-full my-2">
      <button class="bg-zinc-900 p-2 w-full cursor-pointer hover:bg-zinc-800 text-left" @click="selectTimetable(timetable.id)">
        <div class="text-zinc-300">#{{ timetable.id }} &bull; {{ new Date(timetable.createdAt).toLocaleString() }}</div>
        <b>{{ timetable.driverName }} | {{ timetable.trainCategoryCode }} {{ timetable.trainNo }}</b> {{ timetable.route.replace('|', ' > ') }}
      </button>

      <!-- <button class="bg-zinc-900 p-2 hover:bg-zinc-800" @click="removeTimetable(timetable.timetableId)">
          <TrashIcon class="size-5 text-white" />
        </button> -->
    </li>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global.store';
import { useApiStore } from '../../stores/api.store';
import { onMounted } from 'vue';
import { ExclamationCircleIcon } from '@heroicons/vue/16/solid';

const globalStore = useGlobalStore();
const apiStore = useApiStore();
const i18n = useI18n();

onMounted(() => {
  // apiStore.fetchTimetableHistoryList();
});

function selectTimetable(timetableId: number) {}
</script>

<style scoped></style>
