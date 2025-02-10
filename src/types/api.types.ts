import type { ActiveData, JournalTimetableDetailed, JournalTimetableShort, SceneryData } from './common.types';

export type ActiveDataResponse = ActiveData;

export type SceneriesDataResponse = SceneryData[];

export type JournalTimetableShortResponse = JournalTimetableShort[];
export type JournalTimetableDetailedResponse = JournalTimetableDetailed[];

export enum DataStatus {
  'LOADING' = 0,
  'SUCCESS' = 1,
  'ERROR' = 2,
}
