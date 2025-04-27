<template>
  <div class="text-white min-h-screen bg-zinc-950">
    <Navbar />
    <MainContainer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from './components/App/Navbar.vue';
import MainContainer from './components/App/MainContainer.vue';
import { onMounted } from 'vue';
import { useApiStore } from './stores/api.store';
import { useGlobalStore } from './stores/global.store';
import { useI18n } from 'vue-i18n';

const originalDocumentTitle = document.title;

const apiStore = useApiStore();
const globalStore = useGlobalStore();
const i18n = useI18n();

onMounted(async () => {
  setupLocale();
  setupDarkMode();
  loadStorageTimetables();
  setupAfterPrintClose();

  await apiStore.setupAPIData();

  const query = new URLSearchParams(window.location.search);

  if (query.has('id')) {
    const id = query.get('id')!;

    const queryTrain = apiStore.activeData?.trains.find((train) => train.id == id);

    if (queryTrain) {
      globalStore.selectedTrainId = id;
      globalStore.selectedActiveTrain = queryTrain;
    }
  }
});

function loadStorageTimetables() {
  if (!window.localStorage.getItem('savedTimetables')) return;

  try {
    globalStore.storageTimetables = JSON.parse(window.localStorage.getItem('savedTimetables')!);
  } catch (error) {
    alert('Ups! Coś poszło nie tak podczas pobierania zapisanych RJ!');
  }
}

function setupDarkMode() {
  globalStore.darkMode =
    localStorage.currentTheme === 'dark' ||
    (!('currentTheme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function setupAfterPrintClose() {
  window.addEventListener('afterprint', () => {
    document.title = originalDocumentTitle;
  });
}

function setupLocale() {
  if (window.localStorage.getItem('locale') == null) {
    const browserLang = window.navigator.language;
    if (browserLang == 'pl-PL') i18n.locale.value = browserLang == 'pl-PL' ? 'pl' : 'en';
    window.localStorage.setItem('locale', i18n.locale.value);
  } else {
    i18n.locale.value = window.localStorage.getItem('locale')!;
  }
}
</script>
