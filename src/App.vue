<template>
  <div class="text-white min-h-screen bg-zinc-950 print:bg-white">
    <!-- PWA update prompt -->
    <transition name="slide-anim">
      <UpdatePrompt v-if="needRefresh" @onUpdateClick="updateApp()" />
    </transition>

    <!-- Content -->
    <Navbar v-if="!globalStore.fullscreenMode" />
    <MainContainer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from './components/App/Navbar.vue';
import MainContainer from './components/App/MainContainer.vue';
import UpdatePrompt from './components/App/UpdatePrompt.vue';

import { onMounted } from 'vue';
import { useApiStore } from './stores/api.store';
import { useGlobalStore } from './stores/global.store';
import { useI18n } from 'vue-i18n';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { DataStatus } from './types/api.types';

const originalDocumentTitle = document.title;

const apiStore = useApiStore();
const globalStore = useGlobalStore();
const i18n = useI18n();

const { needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });

onMounted(async () => {
  setupLocale();
  setupDarkMode();
  setupOfflineMode();
  loadStorageTimetables();
  setupAfterPrintClose();

  await apiStore.setupAPIData();
  handleQueries();
});

function updateApp() {
  updateServiceWorker(true);
  needRefresh.value = false;
}

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

function setupOfflineMode() {
  apiStore.connectionMode = !navigator.onLine ? 'offline' : 'online';

  window.addEventListener('offline', () => {
    apiStore.connectionMode = 'offline';

    apiStore.journalTimetablesData = null;
    apiStore.activeData = null;
  });

  window.addEventListener('online', () => {
    apiStore.connectionMode = 'online';
    apiStore.journalDataStatus = DataStatus.SUCCESS;

    apiStore.setupAPIData();
  });
}

function handleQueries() {
  const query = new URLSearchParams(window.location.search);

  if (query.has('id')) {
    const id = query.get('id')!;

    const queryTrain = apiStore.activeData?.trains.find((train) => train.id == id);

    if (queryTrain) {
      globalStore.selectedTrainId = id;
      globalStore.selectedActiveTrain = queryTrain;
    }
  }
}
</script>
