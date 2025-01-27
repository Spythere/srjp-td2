<template>
  <div class="min-h-screen bg-zinc-950">
    <nav class="bg-zinc-900 w-full p-1 print:hidden flex justify-between items-center">
      <div class="flex items-center">
        <img src="/favicon.svg" class="size-8 inline" />
        <b class="ml-2 text-lg"
          >Rozkładownik TD2 <sup class="font-semibold text-zinc-300">{{ version }}</sup></b
        >
      </div>
      <div v-if="apiMode == 'mocking'"><ExclamationTriangleIcon class="size-6 inline mr-1 text-yellow-400" /> API mocking</div>
    </nav>

    <main class="grid print:block p-3 mx-auto max-w-[800px] h-screen grid-rows-[auto_1fr_20px] gap-1">
      <div class="flex gap-2 mb-2">
        <select
          name="trains"
          id="trains-select"
          class="bg-zinc-800 p-1 rounded-md print:hidden w-full"
          v-model="selectedTrainId"
          @change="selectTrain"
        >
          <option :value="train.id" v-for="train in activeTimetableTrains">
            {{ train.driverName }} | {{ train.timetable?.category }} {{ train.trainNo }}
          </option>
        </select>

        <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="openPrintingWindow">
          <PrinterIcon class="text-white size-6" />
        </button>

        <button class="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" @click="refreshData">
          <ArrowPathIcon class="text-white size-6" />
        </button>
      </div>

      <div class="overflow-auto py-1">
        <b v-if="selectedTrain" class="my-2"
          >{{ selectedTrain.timetable!.category }} {{ selectedTrain.trainNo }} Relacja {{ selectedTrain.timetable?.route.replace('|', ' - ') }}</b
        >

        <table class="table-fixed mt-2">
          <thead>
            <tr>
              <th width="40" class="border border-white print:border-black">Nr <br />linii</th>
              <th width="100" class="border border-white print:border-black">Km</th>
              <th width="35" class="border border-white print:border-black">V<sub>P</sub></th>
              <th width="35" class="border border-white print:border-black">V<sub>L</sub></th>
              <th width="200" class="border border-white print:border-black">Stacja</th>
              <th width="100" class="border border-white print:border-black">Godzina</th>
              <th width="50" class="border border-white print:border-black text-xs p-0">
                <table>
                  <tbody>
                    <tr class="border-b-white print:border-b-black border-b">
                      <td class="">Lok I</td>
                    </tr>
                    <tr class="border-b-white print:border-b-black border-b">
                      <td>Lok II</td>
                    </tr>
                    <tr>
                      <td>Lok III</td>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th width="55" class="border border-white print:border-black text-xs relative">
                <div class="absolute top-0 left-0 w-full h-full">
                  <table class="h-full">
                    <tbody>
                      <tr class="border-b-white print:border-b-black border-b k">
                        <td>Obc. lok.</td>
                      </tr>
                      <tr>
                        <td>Dł. poc.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>
              <th width="50" class="border border-white print:border-black">Vmax</th>
            </tr>
          </thead>
          <tbody v-if="computedTimetable">
            <tr v-for="(row, i) in computedTimetable">
              <td class="text-center align-top border border-white print:border-black">{{ row.realLine }}</td>

              <td class="border border-white print:border-black relative">
                <div class="absolute top-0 left-0 w-full h-full p-0.5">
                  <table class="h-full">
                    <tbody>
                      <tr>
                        <td class="align-top">{{ row.arrivalKm == '0.000' ? '' : row.arrivalKm }}</td>
                      </tr>
                      <tr>
                        <td class="align-bottom">{{ row.departureKm == '0.000' ? '' : row.departureKm }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <td
                class="text-center align-top p-0 print:border-l-black relative"
                :class="{
                  'border-t print:border-t-black': i != 0 && computedTimetable[i - 1].departureSpeed != row.arrivalSpeed,
                  'border-b print:border-b-black': i == computedTimetable.length - 1,
                }"
                colspan="2"
              >
                <div class="absolute top-0 left-0 w-full h-full">
                  <table class="h-full">
                    <tbody>
                      <tr
                        :class="{
                          'align-top': i == 0 || computedTimetable[i - 1].departureTracks == row.arrivalTracks,
                        }"
                      >
                        <td :colspan="row.arrivalTracks == 2 ? '1' : '2'" class="font-bold" width="35">
                          {{
                            i == 0 ||
                            computedTimetable[i - 1].departureSpeed != row.arrivalSpeed ||
                            computedTimetable[i - 1].departureTracks != row.arrivalTracks
                              ? row.arrivalSpeed
                              : '&nbsp; '
                          }}
                        </td>
                        <td v-if="row.arrivalTracks == 2" class="border-l print:border-l-black" width="35">
                          {{
                            i == 0 ||
                            computedTimetable[i - 1].departureSpeed != row.arrivalSpeed ||
                            computedTimetable[i - 1].departureTracks != row.arrivalTracks
                              ? row.arrivalSpeed
                              : '&nbsp; '
                          }}
                        </td>
                      </tr>
                      <tr
                        :class="{
                          'border-t print:border-t-black': row.arrivalTracks != row.departureTracks || row.departureSpeed != row.arrivalSpeed,
                          'align-top': row.arrivalTracks != row.departureTracks,
                        }"
                      >
                        <td :colspan="row.departureTracks == 2 ? '1' : '2'" class="font-bold" width="35">
                          {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp; ' }}
                        </td>

                        <td v-if="row.departureTracks == 2" class="border-l print:border-l-black" width="35">
                          {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp; ' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <td class="border border-white print:border-black relative">
                <div class="absolute top-0 left-0 w-full h-full">
                  <div class="flex flex-col h-full justify-between p-1">
                    <div :class="{ 'font-bold': row.isMain }">
                      {{ row.pointName }}
                      <span v-if="row.stopTime"> ; {{ row.stopType || 'pt' }}</span>
                    </div>

                    <div class="flex justify-between">
                      <span>{{ row.pointKm }}</span>
                      <span>R1, PP</span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="p-0 border border-white print:border-black relative">
                <div class="absolute top-0 left-0 w-full h-full">
                  <table class="h-full">
                    <tbody>
                      <tr class="text-center align-top h-full">
                        <td class="border-r-[1px] border-r-white print:border-r-black" :class="{ 'font-bold': row.stopTime > 0 }">
                          {{
                            (row.scheduledArrivalDate?.getTime() || 0) != (row.scheduledDepartureDate?.getTime() || 0)
                              ? row.scheduledArrivalDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                              : '|'
                          }}
                        </td>
                        <td width="30">{{ row.driveTime ? Math.floor(row.driveTime / 60000) : '' }}</td>
                      </tr>
                      <tr class="text-center align-bottom h-full">
                        <td class="border-r-[1px] border-r-white print:border-r-black" :class="{ 'font-bold': row.stopTime > 0 }">
                          {{ row.scheduledDepartureDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) }}
                        </td>
                        <td width="30" class="font-bold">{{ row.stopTime || '' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <td class="p-0 text-center border border-white print:border-black relative h-24 text-sm" :class="{ 'text-stone-400 ': i > 0 }">
                <table class="h-full">
                  <tbody>
                    <tr class="border-b-[1px] border-b-white print:border-b-black">
                      <td>{{ row.headLocos[0] }}</td>
                    </tr>
                    <tr class="border-b-[1px] border-b-white print:border-b-black">
                      <td>{{ row.headLocos[1] ?? '&nbsp;' }}</td>
                    </tr>
                    <tr>
                      <td>{{ row.headLocos[2] ?? '&nbsp;' }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td class="p-0 text-center border border-white print:border-black relative" :class="{ 'text-stone-400 ': i > 0 }">
                <div class="absolute top-0 left-0 w-full h-full">
                  <table class="h-full">
                    <tbody>
                      <tr class="border-b-[1px] border-b-white print:border-b-black">
                        <td>{{ row.stockMass }}</td>
                      </tr>
                      <tr>
                        <td>{{ row.stockLength }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <td class="text-center border border-white print:border-black" :class="{ 'text-stone-400 ': i > 0 }">70</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="generatedDate" class="text-center text-sm text-zinc-400 mt-1 print:hidden">
        Rozkład wygenerowany w {{ generatedMs }}ms - aktualny dla godziny: {{ generatedDate.toLocaleTimeString() }}
      </footer>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import sceneryCorrections from './data/corrections.json';
import type { ActiveTrain } from './types/common.types';

import { version } from '../package.json';
import { PrinterIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/16/solid';
import { useApiStore } from './stores/api.store';

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

  headLocos: string[];
  stockVmax: number;
  stockLength: number;
  stockMass: number;
}

export default defineComponent({
  components: { PrinterIcon, ArrowPathIcon, ExclamationTriangleIcon },

  data: () => ({
    selectedTrainId: '',
    apiStore: useApiStore(),
    selectedTrain: null as ActiveTrain | null,

    generatedMs: 0,
    generatedDate: null as Date | null,
    version,

    apiMode: import.meta.env.VITE_API_MODE,
  }),

  mounted() {
    this.apiStore.setupAPIData();
  },

  methods: {
    selectTrain() {
      if (!this.apiStore.activeData) return;

      this.selectedTrain = this.activeTimetableTrains.find((train) => train.id == this.selectedTrainId) ?? null;

      if (this.selectTrain != null) this.generatedDate = new Date();
    },

    openPrintingWindow() {
      window.print();
    },

    refreshData() {
      this.apiStore.fetchActiveData();
      this.selectTrain();
    },
  },

  computed: {
    activeTimetableTrains() {
      if (!this.apiStore.activeData) return [];

      return this.apiStore.activeData.trains.filter((train) => train.timetable).sort((t1, t2) => t1.driverName.localeCompare(t2.driverName, 'pl-PL'));
    },

    computedTimetable() {
      if (!this.selectedTrain) return null;

      const timetable = this.selectedTrain.timetable;

      if (!timetable) return null;

      let timeFrom = Date.now();

      const headLocos = this.selectedTrain.stockString
        .split(';')
        .slice(0, 3)
        .filter((s, i) => i == 0 || /-\d+$/.test(s))
        .map((s) => s.slice(0, s.indexOf('-')));

      const stockVmax = 70,
        stockMass = Math.floor(this.selectedTrain.mass / 1000),
        stockLength = this.selectedTrain.length;

      const timetablePath = timetable.path.split(';').map((pathEl) => {
        const [arrivalLine, scenery, departureLine] = pathEl.split(',');
        const sceneryName = scenery.split(' ').slice(0, -1).join(' ');

        const sceneryData = this.apiStore.sceneryData?.find((sc) => sc.name == sceneryName) ?? null;
        const arrivalLineData = arrivalLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == arrivalLine) ?? null : null;
        const departureLineData = departureLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == departureLine) ?? null : null;

        return {
          sceneryName,
          sceneryData: sceneryData ?? null,
          arrivalLine: arrivalLine ?? '',
          arrivalLineData,
          departureLine: departureLine ?? '',
          departureLineData,
          lineCorrections: sceneryCorrections.find((sc) => sc.sceneryName == sceneryName)?.lineCorrections ?? [],
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

      // console.log('=========== ' + this.selectedTrain.trainNo + ' ===========');

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

          const lineCorrection =
            stop.departureLine != null ? currentPath.lineCorrections.find((corr) => corr.lineName == stop.departureLine) : undefined;

          if (lineCorrection) {
            correctedDepartureSpeed = lineCorrection.departureSpeed;
            departureSpeed = lineCorrection.departureSpeed;

            correctedDepartureTracks = lineCorrection.departureTracks;
            departureTracks = lineCorrection.departureTracks;
          }

          let rowData: StopRow = {
            isMain: /^<strong>/.test(stop.stopName),
            pointKm: stop.stopDistance.toFixed(3),
            pointName: stop.stopNameRAW,
            scheduledArrivalDate: stop.arrivalTimestamp ? new Date(stop.arrivalTimestamp) : null,
            scheduledDepartureDate: stop.departureTimestamp ? new Date(stop.departureTimestamp) : null,
            stopTime: stop.stopTime ? (stop.departureTimestamp - stop.arrivalTimestamp) / 60000 : 0,
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

            headLocos,
            stockVmax,
            stockLength,
            stockMass,
          };

          // console.log(stop.stopNameRAW, stop.departureLine);

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

      let timeTo = Date.now();

      this.generatedMs = timeTo - timeFrom;

      return stopRows;
    },
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

.no-bottom-border {
  border-bottom-color: transparent;
}

@media print {
  table {
    page-break-after: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }
}
</style>
