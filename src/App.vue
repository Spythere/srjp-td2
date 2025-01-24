<template>
  <div class="app">
    <select name="trains" id="trains-select" class="mb-2 bg-zinc-800 p-1 rounded-md" v-model="selectedTrainId">
      <option :value="train.id" v-for="train in timetableTrains">{{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }}</option>
    </select>

    <table class="srjp-table">
      <thead>
        <tr>
          <th width="50" class="border border-white">Nr linii</th>
          <th width="100" class="border border-white">Km</th>
          <th width="40" class="border border-white" colspan="2">V<sub>D</sub></th>
          <th width="250" class="border border-white">Stacja</th>
          <th width="100" class="border border-white">Godzina</th>
          <th width="50" class="border border-white text-xs p-0">
            <table class="header-table">
              <tbody>
                <tr>
                  <td>Lok I</td>
                </tr>
                <tr>
                  <td>Lok II</td>
                </tr>
                <tr>
                  <td>Lok III</td>
                </tr>
              </tbody>
            </table>
          </th>
          <th width="60" class="border border-white text-xs p-0">
            <table class="header-table">
              <tbody>
                <tr>
                  <td>Obc. lok.</td>
                </tr>
                <tr>
                  <td>Dł. poc.</td>
                </tr>
              </tbody>
            </table>
          </th>
          <th width="50" class="border border-white">Vmax</th>
        </tr>
      </thead>
      <tbody v-if="computedTimetable">
        <tr v-for="(row, i) in computedTimetable">
          <td class="text-center align-top border border-white">{{ row.realLine }}</td>
          <td class="border border-white">
            <table>
              <tbody>
                <tr>
                  <td class="align-top">{{ row.arrivalKm }}</td>
                </tr>
                <tr>
                  <td class="align-bottom">{{ row.departureKm }}</td>
                </tr>
              </tbody>
            </table>
          </td>

          <td class="text-center align-top font-bold p-0 border-l-4" colspan="2">
            <table>
              <tbody>
                <tr
                  :class="{
                    'align-top': i == 0 || computedTimetable[i - 1].departureTracks == row.arrivalTracks,
                    'border-t': i != 0 && computedTimetable[i - 1].departureSpeed != row.arrivalSpeed,
                  }"
                >
                  <td :colspan="row.arrivalTracks == 2 ? '1' : '2'">
                    {{
                      i == 0 ||
                      computedTimetable[i - 1].departureSpeed != row.arrivalSpeed ||
                      computedTimetable[i - 1].departureTracks != row.arrivalTracks
                        ? row.arrivalSpeed
                        : '&nbsp;'
                    }}
                  </td>
                  <td v-if="row.arrivalTracks == 2" class="border-l">
                    {{
                      i == 0 ||
                      computedTimetable[i - 1].departureSpeed != row.arrivalSpeed ||
                      computedTimetable[i - 1].departureTracks != row.arrivalTracks
                        ? row.arrivalSpeed
                        : '&nbsp;'
                    }}
                  </td>
                </tr>
                <tr
                  :class="{
                    'border-b': i == computedTimetable.length - 1,
                    'border-t': row.arrivalTracks != row.departureTracks || row.departureSpeed != row.arrivalSpeed,
                    'align-top': row.arrivalTracks != row.departureTracks,
                  }"
                >
                  <td :colspan="row.departureTracks == 2 ? '1' : '2'">
                    {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp;' }}
                  </td>
                  <td v-if="row.departureTracks == 2" class="border-l">
                    {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp;' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          <td class="p-1 border border-white">
            <div class="flex flex-col h-full justify-between">
              <div :class="{ 'font-bold': row.isMain }">
                {{ row.pointName }}
                <span v-if="row.stopType"> ; {{ row.stopType }}</span>
              </div>

              <div class="flex justify-between">
                <span>{{ row.pointKm }}</span>
                <span>R1, PP</span>
              </div>
            </div>
          </td>

          <td class="border border-white">
            <table>
              <tbody>
                <tr class="text-center align-top">
                  <td class="border-r-[1px] border-r-white" :class="{ 'font-bold': row.stopTime > 0 }">
                    {{
                      (row.scheduledArrivalDate?.getTime() || 0) != (row.scheduledDepartureDate?.getTime() || 0)
                        ? row.scheduledArrivalDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                        : '|'
                    }}
                  </td>
                  <td width="30">{{ row.driveTime ? Math.floor(row.driveTime / 60000) : '' }}</td>
                </tr>
                <tr class="text-center align-bottom">
                  <td class="border-r-[1px] border-r-white" :class="{ 'font-bold': row.stopTime > 0 }">
                    {{ row.scheduledDepartureDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) }}
                  </td>
                  <td width="30" class="font-bold">{{ row.stopTime || '' }}</td>
                </tr>
              </tbody>
            </table>
          </td>

          <td class="p-0 text-center border border-white">
            <table>
              <tbody>
                <tr class="border-b-[1px] border-b-white">
                  <td>{{ selectedTrain!.stockString.split(';')[0].split('-')[0] }}</td>
                </tr>
                <tr class="border-b-[1px] border-b-white">
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>

          <td class="p-0 text-center border border-white">
            <table>
              <tbody>
                <tr class="border-b-[1px] border-b-white">
                  <td>{{ Math.floor(selectedTrain!.mass / 1000) }}</td>
                </tr>
                <tr>
                  <td>{{ selectedTrain!.length }}</td>
                </tr>
              </tbody>
            </table>
          </td>

          <td class="text-center border border-white">70</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from './stores/global.store';

const routeCorrections: Record<string, { departureSpeed: Record<string, number>; departureTracks: Record<string, number> }> = {
  Wielichowo: {
    departureSpeed: {
      'WW-Br': 120,
      'WG-WG(gt)': 100,
      'WG(gt)-Żak': 120
    },
    departureTracks: {},
  },
  'LCS Żywiec': {
    departureSpeed: {
      'CI-WG': 60,
      'CD-CI': 70,
      'RW-CD': 110,
      'BLp-BBL': 120,
      'WB-ŁG': 70,
      'Ło-PŻ': 60,
      'Że-RW': 120,
    },
    departureTracks: {
      'BLp-BBL': 2,
      'WB-ŁG': 1,
      'Że-RW': 1,
    },
  },
  'LCS Kleszczów': {
    departureSpeed: {
      it1587_1606: 160,
      it1551_1568: 160,
    },
    departureTracks: {},
  },
  'LCS Perzów': {
    departureSpeed: {
      'Pz-Ow': 120,
    },
    departureTracks: {
      'Pz-Ow': 2,
    },
  },
  'LCS Sandomierz': {
    departureSpeed: {
      'Sn-ZG': 90,
    },
    departureTracks: {
      'Sn-ZG': 1,
    },
  },
  'Włoszczowa Północ': {
    departureSpeed: {
      'it19': 100,
    },
    departureTracks: {
      'it19': 1,
    },
  }
};

interface StopRow {
  pointName: string;
  pointKm: string;
  isMain: boolean;
  stopTime: number;
  stopType: string;
  scheduledArrivalDate: Date | null;
  scheduledDepartureDate: Date | null;
  realLine: string;
  driveTime: number;
  controlAbbrevs: string[];
  additionalAbbrevs: string[];

  sceneryName: string;

  arrivalKm: string;

  arrivalSpeed: number;
  arrivalTracks: number;

  departureKm: string;

  departureSpeed: number;
  departureTracks: number;
}

export default defineComponent({
  data: () => ({
    selectedTrainId: '',
    globalStore: useGlobalStore(),
  }),

  mounted() {
    this.globalStore.setupData();
  },

  computed: {
    timetableTrains() {
      return this.globalStore.activeData?.trains.filter((train) => train.timetable != undefined) ?? [];
    },

    selectedTrain() {
      return this.timetableTrains.find((train) => train.id == this.selectedTrainId);
    },

    computedTimetable() {
      if (!this.selectedTrain) return null;

      const timetable = this.selectedTrain.timetable;

      if (!timetable) return null;

      const timetablePath = timetable.path.split(';').map((pathEl) => {
        const [arrivalLine, scenery, departureLine] = pathEl.split(',');
        const sceneryName = scenery.split(' ').slice(0, -1).join(' ');

        const sceneryData = this.globalStore.sceneryData?.find((sc) => sc.name == sceneryName) ?? null;
        const arrivalLineData = arrivalLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == arrivalLine) ?? null : null;
        const departureLineData = departureLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == departureLine) ?? null : null;

        return {
          sceneryName,
          speedCorrections: routeCorrections[sceneryName] ?? null,
          arrivalLine: arrivalLine ?? '',
          arrivalLineData,
          departureLine: departureLine ?? '',
          departureLineData,
        };
      });

      const stopRows: StopRow[] = [];

      let currentPathIndex = 0;
      let currentPath = timetablePath[0];

      let lastDepartureTimestamp = 0;

      let arrivalKm = 0,
        arrivalSpeed = currentPath.departureLineData?.routeSpeed ?? 0,
        arrivalTracks = currentPath.departureLineData?.routeTracks ?? 0;

      let departureSpeed = currentPath.departureLineData?.routeSpeed ?? 0,
        departureTracks = currentPath.departureLineData?.routeTracks ?? 2;

      console.log('=========== ' + this.selectedTrain.trainNo + ' ===========');

      for (const stop of timetable.stopList) {
        if (stop.arrivalLine && stop.arrivalLine == currentPath.arrivalLine) {
          arrivalKm = stop.stopDistance;
          arrivalSpeed = currentPath.arrivalLineData?.routeSpeed ?? 0;
          arrivalTracks = currentPath.arrivalLineData?.routeTracks ?? 2;

          departureSpeed = arrivalSpeed;
          departureTracks = arrivalTracks;
        }

        if (/^<strong>|, (podg|po)$|^(!_, pe)$/.test(stop.stopName)) {
          let correctedDepartureSpeed = 0,
            correctedDepartureTracks = 0;

          if (stop.departureLine && currentPath.speedCorrections?.departureSpeed !== undefined) {
            if (currentPath.speedCorrections?.departureSpeed[stop.departureLine] !== undefined) {
              correctedDepartureSpeed = currentPath.speedCorrections?.departureSpeed[stop.departureLine];
              departureSpeed = correctedDepartureSpeed;
            }
          }

          if (stop.departureLine && currentPath.speedCorrections?.departureTracks !== undefined) {
            if (currentPath.speedCorrections?.departureTracks[stop.departureLine] !== undefined) {
              correctedDepartureTracks = currentPath.speedCorrections?.departureTracks[stop.departureLine];
              departureTracks = correctedDepartureTracks;
            }
          }

          let rowData: StopRow = {
            isMain: /^<strong>/.test(stop.stopName),
            pointKm: stop.stopDistance.toFixed(3),
            pointName: stop.stopNameRAW,
            scheduledArrivalDate: stop.arrivalTimestamp ? new Date(stop.arrivalTimestamp) : null,
            scheduledDepartureDate: stop.departureTimestamp ? new Date(stop.departureTimestamp) : null,
            stopTime: stop.stopTime ?? 0,
            stopType: stop.stopType,
            sceneryName: currentPath.sceneryName,
            realLine: '-',
            driveTime: lastDepartureTimestamp ? stop.arrivalTimestamp - lastDepartureTimestamp : 0,
            additionalAbbrevs: [],
            controlAbbrevs: [],

            arrivalKm: arrivalKm.toFixed(3),
            departureKm: stop.stopDistance.toFixed(3),

            arrivalSpeed: arrivalSpeed,
            arrivalTracks: arrivalTracks,

            departureSpeed: departureSpeed,
            departureTracks: departureTracks,
          };

          console.log(stop.stopNameRAW, stop.departureLine);

          arrivalKm = stop.stopDistance;
          arrivalSpeed = correctedDepartureSpeed || arrivalSpeed;
          arrivalTracks = correctedDepartureTracks || arrivalTracks;

          if (stop.departureTimestamp) lastDepartureTimestamp = stop.departureTimestamp;

          stopRows.push(rowData);
        }

        if (stop.departureLine && stop.departureLine == currentPath.departureLine) {
          // Reverse search for last scenery checkpoint
          for (let i = stopRows.length - 1; i > 0; i--) {
            stopRows[i].departureTracks = currentPath.departureLineData?.routeTracks ?? 0;
            stopRows[i].departureSpeed = currentPath.departureLineData?.routeSpeed ?? 0;

            if (stopRows[i].isMain || stopRows[i].pointName.endsWith(', podg')) {
              stopRows[i].departureSpeed = currentPath.departureLineData?.routeSpeed ?? 0;
              stopRows[i].departureTracks = currentPath.departureLineData?.routeTracks ?? 0;
              break;
            }

            stopRows[i].arrivalSpeed = currentPath.departureLineData?.routeSpeed ?? 0;
            stopRows[i].arrivalTracks = currentPath.departureLineData?.routeTracks ?? 0;
          }

          currentPath = timetablePath[++currentPathIndex];
        }
      }

      return stopRows;
    },
  },
});
</script>

<style scoped>
table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

.srjp-table {
  min-width: 750px;
}

.no-bottom-border {
  border-bottom-color: transparent;
}

@media print {
  table {
    page-break-inside: auto;
  }
}
</style>
