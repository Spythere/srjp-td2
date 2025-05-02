<template>
  <div class="text-white">
    <div class="font-bold p-2 bg-zinc-700 mb-3">
      <div class="text-2xl flex items-center gap-2 justify-center flex-wrap">
        <ArchiveIcon :size="25" />
        <span>{{ $t('storage-preview-title') }}</span>
      </div>
    </div>

    <div
      v-if="
        globalStore.selectedStorageTimetable == null &&
        Object.keys(globalStore.storageTimetables).length == 0
      "
      class="text-zinc-400"
    >
      {{ $t('storage-empty-info') }}
    </div>

    <div class="font-bold p-2 bg-zinc-800 mb-3" v-else-if="filteredTimetables.length == 0">
      {{ $t('storage-preview-empty') }}
    </div>

    <ul v-else>
      <li v-for="timetable in filteredTimetables" class="flex gap-1 w-full my-2">
        <button
          class="bg-zinc-900 p-2 w-full cursor-pointer hover:bg-zinc-800 text-left"
          @click="selectTimetable(timetable)"
        >
          <div class="text-zinc-300 flex gap-x-2 items-center flex-wrap">
            <span>#{{ timetable.timetableId }}</span>
            
            <i class="flex items-center gap-1"><ArchiveIcon :size="18" :stroke-width="3" /> {{ new Date(timetable.savedTimestamp!).toLocaleString() }}</i>

            <i
              v-if="timetable.journalCreatedAt"
              class="flex items-center gap-0.5"
              :title="
                $t('storage-journal-timetable-placeholder', {
                  date: new Date(timetable.journalCreatedAt).toLocaleDateString('pl-PL')
                })
              "
            >
              <HistoryIcon :size="18" :stroke-width="3" />
              {{ new Date(timetable.journalCreatedAt).toLocaleDateString('pl-PL') }}
            </i>
          </div>
          <b>{{ timetable.driverName }} | {{ timetable.category }} {{ timetable.trainNo }}</b>
          {{ timetable.route.replace('|', ' > ') }}
        </button>

        <button
          class="bg-zinc-900 p-2 hover:bg-zinc-800"
          @click="removeTimetable(timetable.timetableId)"
        >
          <Trash2Icon />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '../../stores/global.store';
import type { TimetableData } from '../../types/common.types';
import { ArchiveIcon, HistoryIcon, Trash2Icon } from 'lucide-vue-next';

const globalStore = useGlobalStore();
const i18n = useI18n();

const filteredTimetables = computed(() => {
  let timetables = Object.values(globalStore.storageTimetables);

  if (globalStore.localTimetableSearch.length != 0)
    timetables = timetables.filter((st) =>
      `${st.timetableId} ${st.driverName} ${st.route} ${st.category} ${st.trainNo}`
        .toLocaleLowerCase()
        .includes(globalStore.localTimetableSearch.toLocaleLowerCase())
    );

  timetables.sort((a, b) => {
    return (b.savedTimestamp ?? 0) - (a.savedTimestamp ?? 0);
  });

  return timetables;
});

function selectTimetable(timetable: TimetableData) {
  globalStore.selectedStorageTimetable = timetable;
}

function removeTimetable(timetableId: number) {
  const isConfirmed = confirm(i18n.t('delete-timetable-confirm'));

  if (!isConfirmed) return;

  try {
    const savedTimetablesStorage = localStorage.getItem('savedTimetables');
    let savedTimetablesJSON: Record<number, TimetableData> = savedTimetablesStorage
      ? JSON.parse(savedTimetablesStorage)
      : {};
    delete savedTimetablesJSON[timetableId];

    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetablesJSON));

    globalStore.storageTimetables = savedTimetablesJSON;
  } catch (error) {
    console.error(error);
  }
}
</script>
