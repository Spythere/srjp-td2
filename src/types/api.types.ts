import type { ActiveData, JournalTimetableShort, SceneryData, VehicleData } from './common.types';

export type ActiveDataResponse = ActiveData;

export type SceneriesDataResponse = SceneryData[];

export type JournalTimetablesShortResponse = JournalTimetableShort[];

export type VehiclesDataResponse = VehicleData[];

export enum DataStatus {
  'INIT' = -1,
  'LOADING' = 0,
  'SUCCESS' = 1,
  'ERROR' = 2
}
