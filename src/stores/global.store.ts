import { defineStore } from 'pinia';
import { useApiStore } from './api.store';
import type { ActiveTrain, TimetableData, ViewMode } from '../types/common.types';
import { unitNameCorrections } from '../utils/trainUtils';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkMode: false,
    viewMode: 'active' as ViewMode,

    selectedActiveTrain: null as ActiveTrain | null,
    selectedStorageTimetable: null as TimetableData | null,

    storageTimetables: {} as Record<number, TimetableData>,

    generatedDate: null as Date | null,
    generatedMs: 0,
  }),
  getters: {
    activeTimetableTrains() {
      const apiStore = useApiStore();

      if (!apiStore.activeData) return [];

      return apiStore.activeData.trains.filter((train) => train.timetable).sort((t1, t2) => t1.driverName.localeCompare(t2.driverName, 'pl-PL'));
    },

    currentTimetableData(): TimetableData | null {
      if (this.viewMode == 'active') {
        const selectedTrain = this.selectedActiveTrain;

        if (!selectedTrain || !selectedTrain.timetable) return null;

        return {
          trainNo: selectedTrain.trainNo,
          mass: selectedTrain.mass,
          length: selectedTrain.length,
          driverId: selectedTrain.driverId,
          driverName: selectedTrain.driverName,
          category: selectedTrain.timetable.category,
          hasDangerousCargo: selectedTrain.timetable.hasDangerousCargo,
          hasExtraDeliveries: selectedTrain.timetable.hasExtraDeliveries,
          warningNotes: selectedTrain.timetable.warningNotes,
          path: selectedTrain.timetable.path,
          route: selectedTrain.timetable.route,
          trainMaxSpeed: selectedTrain.timetable.trainMaxSpeed,
          timetableId: selectedTrain.timetable.timetableId,
          stopListString: selectedTrain.timetable.stopList
            .filter((stop) => stop.mainStop || (/^podg|po|pe$/.test(stop.stopNameRAW) && !/^sbl/i.test(stop.stopNameRAW)))
            .map(
              (stop) =>
                `${stop.arrivalLine ?? ''};${stop.arrivalTimestamp};${stop.stopNameRAW};${stop.stopTime ? stop.stopTime + '_' + stop.stopType : ''};${
                  stop.mainStop
                };${stop.stopDistance};${stop.departureTimestamp};${stop.departureLine ?? ''}`
            )
            .join('~~'),
          headUnits: selectedTrain.stockString
            .split(';')
            .slice(0, 3)
            .filter((s, i) => i == 0 || /-\d+$/.test(s))
            .map((s) => {
              const unitName = s.slice(0, s.indexOf('-'));

              return unitNameCorrections[unitName] ?? unitName;
            }),
        };
      } else {
        const selectedStorageTimetable = this.selectedStorageTimetable;
        return selectedStorageTimetable;
      }
    },
  },
  actions: {},
});
