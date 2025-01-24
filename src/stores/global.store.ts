import { defineStore } from 'pinia';
import httpClient from '../utils/http';
import type { ActiveDataResponse, SceneriesDataResponse } from '../types/api.types';
import type { ActiveData, SceneryData } from '../types/common.types';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    activeData: null as ActiveData | null,
    sceneryData: null as SceneryData[] | null,
  }),
  getters: {},
  actions: {
    async _fetchActiveData() {
      try {
        const response = (await httpClient.get<ActiveDataResponse>('/api/getActiveData')).data;

        this.activeData = response;
      } catch (error) {
        console.error(error);
      }
    },

    async _fetchSceneriesData() {
      try {
        const response = (await httpClient.get<SceneriesDataResponse>('/api/getSceneries')).data;

        this.sceneryData = response;
      } catch (error) {
        console.error(error);
      }
    },

    setupData() {
      this._fetchActiveData();
      this._fetchSceneriesData();
      
      setInterval(() => {
        this._fetchActiveData();
      }, 20000);
    },
  },
});
