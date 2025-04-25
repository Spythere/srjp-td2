import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { defineStore } from 'pinia';
import {
  DataStatus,
  type ActiveDataResponse,
  type SceneriesDataResponse,
  type JournalTimetablesShortResponse
} from '../types/api.types';
import type {
  ActiveData,
  JournalTimetableDetailed,
  JournalTimetableShort,
  SceneryData
} from '../types/common.types';
import { useGlobalStore } from './global.store';

export const useApiStore = defineStore('api', {
  state() {
    return {
      client: null as AxiosInstance | null,

      activeData: null as ActiveData | null,
      sceneryData: null as SceneryData[] | null,
      journalTimetablesData: null as JournalTimetableShort[] | null,

      outdatedTimerId: -1,
      isActiveDataOutdated: false,

      activeDataStatus: DataStatus.LOADING,
      journalDataStatus: DataStatus.SUCCESS
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
        baseURL
      });

      this.fetchSceneriesData();
      await this.fetchActiveData();

      setInterval(() => {
        this.fetchActiveData();
      }, 25000);
    },

    async fetchActiveData() {
      try {
        const response = (await this.client!.get<ActiveDataResponse>('/api/getActiveData')).data;

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
        const response = (await this.client!.get<SceneriesDataResponse>('/api/getSceneries')).data;

        this.sceneryData = response;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchJournalTimetables(searchValue: string) {
      // if (searchValue.trim().length == 0) {
      //   this.journalDataStatus = DataStatus.SUCCESS;
      //   this.journalTimetablesData = null;

      //   return;
      // }

      let searchObj: Record<string, any> = {};
      const searchParams = searchValue.split(' ');

      searchParams.forEach((param) => {
        const [key, value] = param.split(':');

        if (key == 'nick') searchObj['driverName'] = value;
        else if (key == 'date') {
          let dateFromStr = new Date(value).toISOString();

          let dateTo = new Date(dateFromStr);
          dateTo.setDate(dateTo.getDate() + 1);

          searchObj['dateFrom'] = dateFromStr;
          searchObj['dateTo'] = dateTo.toISOString();
        } else if (key == 'from') searchObj['issuedFrom'] = value.replace(/_/g, ' ');
        else if (key == 'to') searchObj['terminatingAt'] = value.replace(/_/g, ' ');
      });

      searchObj['hasStopsDetails'] = 1;
      searchObj['returnType'] = 'short';

      try {
        this.journalDataStatus = DataStatus.LOADING;

        const response = (
          await this.client!.get<JournalTimetablesShortResponse>('/api/getTimetables', {
            params: searchObj
          })
        ).data;

        this.journalDataStatus = DataStatus.SUCCESS;
        this.journalTimetablesData = response;
      } catch (error) {
        this.journalDataStatus = DataStatus.ERROR;
        this.journalTimetablesData = null;
        console.error(error);
      }
    },

    async fetchJournalTimetableDetails(id: number) {
      const globalStore = useGlobalStore();

      try {
        const response = (
          await this.client!.get<JournalTimetableDetailed[]>('/api/getTimetables', {
            params: {
              timetableId: id,
              hasStopsDetails: 1
            }
          })
        ).data;

        if (response.length > 0) globalStore.selectedJournalTimetable = response[0];
      } catch (error) {
        globalStore.selectedJournalTimetable = null;
        console.error(error);
      }
    }
  }
});
