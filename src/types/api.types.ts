import type { ActiveData, SceneryData } from './common.types';

export type ActiveDataResponse = ActiveData;

export type SceneriesDataResponse = SceneryData[];

export enum DataStatus {
  'LOADING' = 0,
  'SUCCESS' = 1,
  'ERROR' = 2,
}
