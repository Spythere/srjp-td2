import { defineStore } from 'pinia';
import {
  DataStatus,
  type ActiveDataResponse,
  type SceneriesDataResponse,
  type VehiclesDataResponse
} from '../types/api.types';
import type {
  ActiveData,
  JournalTimetableShort,
  SceneryData,
  VehicleData
} from '../types/common.types';
import { HttpClient } from '../http';

let activeDataInterval = -1;

// Base API URL
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

export const useApiStore = defineStore('api', {
  state() {
    return {
      client: new HttpClient(baseURL),

      activeData: null as ActiveData | null,
      sceneryData: null as SceneryData[] | null,
      vehiclesData: null as VehicleData[] | null,
      journalTimetablesData: null as JournalTimetableShort[] | null,

      outdatedTimerId: -1,
      isActiveDataOutdated: false,

      activeDataStatus: DataStatus.LOADING,
      journalDataStatus: DataStatus.SUCCESS,

      connectionMode: 'online' as 'online' | 'offline'
    };
  },

  actions: {
    async setupAPIData() {
      clearInterval(activeDataInterval);

      activeDataInterval = setInterval(() => {
        this.fetchActiveData();
      }, 25000);

      this.fetchSceneriesData();
      this.fetchVehiclesData();

      await this.fetchActiveData();
    },

    async fetchActiveData() {
      try {
        const response = await this.client.get<ActiveDataResponse>('api/getActiveData');

        this.activeData = response;
        this.activeDataStatus = DataStatus.SUCCESS;
        this.isActiveDataOutdated = false;

        if (this.outdatedTimerId != -1) clearTimeout(this.outdatedTimerId);

        this.outdatedTimerId = setTimeout(() => {
          this.isActiveDataOutdated = true;
        }, 60000);
      } catch (error) {
        console.error(error);
      }
    },

    async fetchSceneriesData() {
      try {
        const response = await this.client.get<SceneriesDataResponse>('api/getSceneries');

        this.sceneryData = response;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchVehiclesData() {
      try {
        const response = await this.client.get<VehiclesDataResponse>('api/getVehicles');

        this.vehiclesData = response;
      } catch (error) {
        console.error(error);
      }
    }
  }
});
