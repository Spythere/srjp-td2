import type { ActiveData, JournalTimetableShort, SceneryData } from './common.types';

export type ActiveDataResponse = ActiveData;

export type SceneriesDataResponse = SceneryData[];

export type JournalTimetablesShortResponse = JournalTimetableShort[]; 

export enum DataStatus {
  'INIT' = -1,
  'LOADING' = 0,
  'SUCCESS' = 1,
  'ERROR' = 2,
}
