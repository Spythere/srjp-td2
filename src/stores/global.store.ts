import { defineStore } from 'pinia';
import { useApiStore } from './api.store';
import type {
  ActiveTrain,
  JournalTimetableDetailed,
  TimetableData,
  ViewMode
} from '../types/common.types';
import { getHeadUnits } from '../utils/trainUtils';
import { useVehicleMixin } from '../mixins/useVehicleMixin';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkMode: false,
    fullscreenMode: false,
    viewMode: 'active' as ViewMode,

    selectedTrainId: null as string | null,
    selectedActiveTrain: null as ActiveTrain | null,
    selectedStorageTimetable: null as TimetableData | null,
    selectedJournalTimetable: null as JournalTimetableDetailed | null,

    storageTimetables: {} as Record<number, TimetableData>,

    timetableWarnings: [] as string[],

    generatedDate: null as Date | null,
    generatedMs: 0,

    localTimetableSearch: '',

    journalTimetableSearch: {
      driverName: '',
      date: '',
      route: ''
    },

    showSettings: false
  }),
  getters: {
    activeTimetableTrains() {
      const apiStore = useApiStore();

      if (!apiStore.activeData) return [];

      return apiStore.activeData.trains
        .filter((train) => train.timetable)
        .sort((t1, t2) => t1.driverName.localeCompare(t2.driverName, 'pl-PL'));
    },

    currentTimetableData(): TimetableData | null {
      const vehicleUtils = useVehicleMixin();

      if (this.viewMode == 'active') {
        const selectedTrain = this.selectedActiveTrain;

        if (!selectedTrain || !selectedTrain.timetable) return null;

        return {
          trainNo: selectedTrain.trainNo,
          mass: vehicleUtils.getLocoLoad(selectedTrain.mass, selectedTrain.stockString),
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
            .filter((stop) => stop.mainStop || /^podg|po|pe$/.test(stop.stopNameRAW))
            .map(
              (stop) =>
                `${stop.arrivalLine ?? ''};${stop.arrivalTimestamp};${stop.stopNameRAW};${
                  stop.stopTime ? stop.stopTime + '_' + stop.stopType : ''
                };${stop.mainStop};${stop.stopDistance};${stop.departureTimestamp};${
                  stop.departureLine ?? ''
                }`
            )
            .join('~~'),
          headUnits: getHeadUnits(selectedTrain.stockString)
        };
      } else if (this.viewMode == 'journal') {
        const selectedTimetable = this.selectedJournalTimetable;

        if (!selectedTimetable || !selectedTimetable.stopListString) return null;

        return {
          journalCreatedAt: new Date(selectedTimetable.createdAt).getTime(),
          trainNo: selectedTimetable.trainNo,
          mass: vehicleUtils.getLocoLoad(
            selectedTimetable.stockMass,
            selectedTimetable.stockString
          ),
          length: selectedTimetable.stockLength,
          driverId: selectedTimetable.driverId,
          driverName: selectedTimetable.driverName,
          category: selectedTimetable.trainCategoryCode,
          hasDangerousCargo: selectedTimetable.hasDangerousCargo,
          hasExtraDeliveries: selectedTimetable.hasExtraDeliveries,
          warningNotes: selectedTimetable.warningNotes,
          path: selectedTimetable.path,
          route: selectedTimetable.route,
          trainMaxSpeed: selectedTimetable.trainMaxSpeed,
          timetableId: selectedTimetable.id,
          stopListString: selectedTimetable.stopListString,
          headUnits: getHeadUnits(selectedTimetable.stockString)
        };
      } else {
        return this.selectedStorageTimetable;
      }
    }
  },
  actions: {}
});
