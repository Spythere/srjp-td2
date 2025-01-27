import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { defineStore } from 'pinia';
import { DataStatus, type ActiveDataResponse, type SceneriesDataResponse } from '../types/api.types';
import type { ActiveData, SceneryData } from '../types/common.types';

export const useApiStore = defineStore('api', {
  state() {
    return {
      client: null as AxiosInstance | null,
      
      activeData: null as ActiveData | null,
      sceneryData: null as SceneryData[] | null,

      activeDataStatus: DataStatus.LOADING
    };
  },

  actions: {
    async setupAPIData() {
      if (this.client != null) return;

      let baseURL = 'https://stacjownik.spythere.eu';

      switch (import.meta.env.VITE_API_MODE) {
        case 'development':
          baseURL = 'http://localhost:3001';
          break;
        case 'mocking':
          baseURL = 'http://localhost:3123';
          break;
        default:
          break;
      }

      this.client = axios.create({
        baseURL,
      });
      
      this.fetchSceneriesData();
      this.fetchActiveData();

      setInterval(() => {
        this.fetchActiveData();
      }, 20000);
    },

    async fetchActiveData() {
      try {
        const response = (await this.client!.get<ActiveDataResponse>('/api/getActiveData')).data;

        this.activeData = response;
        this.activeDataStatus = DataStatus.SUCCESS;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchSceneriesData() {
      try {
        const response = (await this.client!.get<SceneriesDataResponse>('/api/getSceneries')).data;

        this.sceneryData = response;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
