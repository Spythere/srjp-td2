import type {
  ActiveData,
  JournalTimetableShort,
  SceneryData,
  VehicleGroup,
  VehicleRestrictions
} from './common.types';

/***
 * API Data Status
 * */


export enum DataStatus {
  'INIT' = -1,
  'LOADING' = 0,
  'SUCCESS' = 1,
  'ERROR' = 2
}

/***
 * Active Data API
 * */

export type ActiveDataResponse = ActiveData;

/***
 * Sceneries API
 * */

export type SceneriesDataResponse = SceneryData[];

/***
 * Journal API
 * */

export type JournalTimetablesShortResponse = JournalTimetableShort[];

/***
 * Vehicles API
 * */

export interface VehiclesDataResponse {
  vehicles: VehicleDataAPI[];
  vehicleGroups: VehicleGroupAPI[];
}

export interface VehicleDataAPI {
  id: number;
  name: string;
  type: string;
  cabinName?: string;
  restrictions?: VehicleRestrictions;
  vehicleGroupsId: number;
}

export interface VehicleGroupAPI extends VehicleGroup {}
