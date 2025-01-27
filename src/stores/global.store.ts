import { defineStore } from 'pinia';
import { useApiStore } from './api.store';
import type { ActiveTrain } from '../types/common.types';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    selectedTrain: null as ActiveTrain | null,


    generatedDate: null as Date | null,
    generatedMs: 0,
  }),
  getters: {
    activeTimetableTrains() {
      const apiStore = useApiStore();

      if (!apiStore.activeData) return [];

      return apiStore.activeData.trains.filter((train) => train.timetable).sort((t1, t2) => t1.driverName.localeCompare(t2.driverName, 'pl-PL'));
    },
  },
  actions: {},
});
