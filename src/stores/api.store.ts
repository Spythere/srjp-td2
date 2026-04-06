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

      apiDataStatus: DataStatus.LOADING,
      journalDataStatus: DataStatus.SUCCESS,

      connectionMode: 'online' as 'online' | 'offline'
    };
  },

  actions: {
    async setupAPIData() {
      clearInterval(activeDataInterval);

      try {
        this.apiDataStatus = DataStatus.LOADING;

        await Promise.all([
          this.fetchSceneriesData(),
          this.fetchVehiclesData(),
          this.fetchActiveData()
        ]);

        this.apiDataStatus = DataStatus.SUCCESS;
      } catch (error) {
        this.apiDataStatus = DataStatus.ERROR;
        console.log('Data fetching error: ', error);
      }

      activeDataInterval = setInterval(() => {
        this.fetchActiveData();
      }, 25000);
    },

    async fetchActiveData() {
      try {
        const response = await this.client.get<ActiveDataResponse>('api/getActiveData');

        this.activeData = response;
        this.isActiveDataOutdated = false;

        if (this.outdatedTimerId != -1) clearTimeout(this.outdatedTimerId);

        this.outdatedTimerId = setTimeout(() => {
          this.isActiveDataOutdated = true;
        }, 60000);
      } catch (error) {
        throw error;
      }
    },

    async fetchSceneriesData() {
      try {
        const response = await this.client.get<SceneriesDataResponse>('api/getSceneries');

        this.sceneryData = response;
      } catch (error) {
        throw error;
      }
    },

    async fetchVehiclesData() {
      try {
        const response = await this.client.get<VehiclesDataResponse>('api/getVehiclesData');

        this.vehiclesData = response.vehicles.map((v) => ({
          ...v,
          group: response.vehicleGroups.find((g) => g.id == v.vehicleGroupsId)!
        }));
      } catch (error) {
        throw error;
      }
    }
  }
});
