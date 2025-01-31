<template>
  <div
    :class="{ dark: globalStore.darkMode }"
    v-if="globalStore.currentTimetableData != null"
    class="overflow-auto p-1 bg-white print:bg-white dark:bg-zinc-950 print:text-black text-black dark:text-white min-h-full"
  >
    <div>
      <div class="p-1 font-bold w-max">
        {{ globalStore.currentTimetableData.category }} {{ globalStore.currentTimetableData.trainNo }} {{ $t('headers.relation') }}
        {{ globalStore.currentTimetableData.route.replace('|', ' - ') }}
      </div>

      <table class="table-fixed mt-2 w-full border-collapse" v-if="computedTimetableRows.length > 0">
        <TimetableHeader />
        <TimetableBody :computed-timetable="computedTimetableRows" />
      </table>
    </div>
  </div>

  <div class="overflow-auto text-center font-bold text-zinc-400 p-1 min-h-full" v-else>
    <div v-if="globalStore.viewMode == 'active'">
      <div>{{$t('train-select-info')}}</div>
    </div>

    <div v-else>
      <TimetableStorage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
``;
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import TimetableBody from './TimetableBody.vue';
import TimetableHeader from './TimetableHeader.vue';
import type { SceneryRoute, StopRow, TimetablePathData } from '../../types/common.types';
import TimetableStorage from './TimetableStorage.vue';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

// Tymczasowa tabelka z posterunkami APO
// const apoNames = ['Stary Kisielin, pe', 'Czerwony Dwór, pe', 'Szczejkowice, pe'];

const computedTimetableRows = computed(() => {
  const timetableData = globalStore.currentTimetableData;

  if (!timetableData) return [];

  let timeFrom = Date.now();

  const stockVmax = timetableData.trainMaxSpeed,
    stockMass = Math.floor(timetableData.mass / 1000),
    stockLength = timetableData.length;

  const timetablePath = parseTimetablePath(timetableData.path);

  const stopRows: StopRow[] = [];

  let currentPathIndex = 0;
  let currentPath = timetablePath[0];

  let lastDepartureTimestamp = 0;

  let arrivalKm = 0,
    arrivalSpeed = 0,
    arrivalTracks = 0,
    departureSpeed = 0,
    departureTracks = 2,
    realLineNo = 0,
    abbrevs = [] as string[];

  if (currentPath.departureLineData) {
    arrivalSpeed = currentPath.departureLineData.routeSpeed;
    arrivalTracks = currentPath.departureLineData.routeTracks;

    departureSpeed = currentPath.departureLineData.routeSpeed;
    departureTracks = currentPath.departureLineData.routeTracks;

    realLineNo = currentPath.departureLineData?.realLineNo ?? 0;
    abbrevs = getAbbrevs(currentPath.departureLineData);
  }

  // console.debug('=========== ' + this.selectedTrain.trainNo + ' ===========');

  const stopList = parseStopListString(timetableData.stopListString);

  for (const stop of stopList) {
    if (stop.arrivalLine && stop.arrivalLine == currentPath.arrivalLine) {
      arrivalKm = stop.stopDistance;

      if (currentPath.arrivalLineData) {
        arrivalSpeed = currentPath.arrivalLineData.routeSpeed;
        arrivalTracks = currentPath.arrivalLineData.routeTracks;
        realLineNo = currentPath.arrivalLineData.realLineNo ?? 0;
        abbrevs = getAbbrevs(currentPath.arrivalLineData);
      }

      departureSpeed = arrivalSpeed;
      departureTracks = arrivalTracks;
    }

    if (stop.mainStop || (/^podg|po|pe$/.test(stop.stopNameRAW) && !/^sbl/i.test(stop.stopNameRAW))) {
      let correctedDepartureSpeed = 0,
        correctedDepartureTracks = 0;

      const internalRouteInfo = stop.departureLine
        ? currentPath.sceneryData?.routesInfo.find((route) => route.isInternal && route.routeName == stop.departureLine)
        : undefined;

      if (internalRouteInfo) {
        correctedDepartureSpeed = internalRouteInfo.routeSpeed;
        departureSpeed = internalRouteInfo.routeSpeed;
        realLineNo = internalRouteInfo.realLineNo ?? realLineNo;
        abbrevs = getAbbrevs(internalRouteInfo);

        correctedDepartureTracks = internalRouteInfo.routeTracks;
        departureTracks = internalRouteInfo.routeTracks;
      }

      let rowData: StopRow = {
        isMain: stop.mainStop,
        pointKm: stop.stopDistance.toFixed(3),
        pointName: stop.stopNameRAW,
        scheduledArrivalDate: stop.arrivalTimestamp ? new Date(stop.arrivalTimestamp) : null,
        scheduledDepartureDate: stop.departureTimestamp ? new Date(stop.departureTimestamp) : null,
        stopTime: stop.stopTime ? (stop.departureTimestamp - stop.arrivalTimestamp) / 60000 : 0,
        stopType: stop.stopType,
        sceneryName: currentPath.sceneryName,
        realLine: realLineNo == 0 ? '' : realLineNo.toString(),
        driveTime: lastDepartureTimestamp ? stop.arrivalTimestamp - lastDepartureTimestamp : 0,

        abbrevs,

        arrivalKm: arrivalKm.toFixed(3),
        departureKm: stop.stopDistance.toFixed(3),

        arrivalSpeed: arrivalSpeed,
        arrivalTracks: arrivalTracks,

        departureSpeed: departureSpeed,
        departureTracks: departureTracks,

        headUnits: timetableData.headUnits,
        stockVmax,
        stockLength,
        stockMass,
      };

      // if (apoNames.includes(stop.stopNameRAW)) abbrevs.unshift(`APO ${currentPath.sceneryData?.abbr}`);

      // console.debug(stop.stopNameRAW, stop.departureLine);

      arrivalKm = stop.stopDistance;
      arrivalSpeed = correctedDepartureSpeed || arrivalSpeed;
      arrivalTracks = correctedDepartureTracks || arrivalTracks;

      if (stop.departureTimestamp) lastDepartureTimestamp = stop.departureTimestamp;

      stopRows.push(rowData);
    }

    if (stop.departureLine && stop.departureLine == currentPath.departureLine) {
      // Reverse search for last scenery checkpoint
      for (let i = stopRows.length - 1; i > 0; i--) {
        if (currentPath.departureLineData) {
          stopRows[i].departureTracks = currentPath.departureLineData.routeTracks;
          stopRows[i].departureSpeed = currentPath.departureLineData.routeSpeed;
          stopRows[i].realLine = currentPath.departureLineData.realLineNo?.toString() ?? '';

          if (stopRows[i].isMain || stopRows[i].pointName.endsWith(', podg')) {
            stopRows[i].departureSpeed = currentPath.departureLineData.routeSpeed;
            stopRows[i].departureTracks = currentPath.departureLineData.routeTracks;

            abbrevs = getAbbrevs(currentPath.departureLineData);
            stopRows[i].abbrevs = abbrevs;
            break;
          }

          stopRows[i].arrivalSpeed = currentPath.departureLineData.routeSpeed;
          stopRows[i].arrivalTracks = currentPath.departureLineData.routeTracks;
        }
      }

      currentPath = timetablePath[++currentPathIndex];
    }
  }

  let timeTo = Date.now();

  globalStore.generatedMs = timeTo - timeFrom;

  return stopRows;
});

function parseTimetablePath(path: string): TimetablePathData[] {
  return path.split(';').map((pathEl) => {
    const [arrivalLine, scenery, departureLine] = pathEl.split(',');
    const sceneryName = scenery.split(' ').slice(0, -1).join(' ');

    const sceneryData = apiStore.sceneryData?.find((sc) => sc.name == sceneryName) ?? null;
    const arrivalLineData = arrivalLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == arrivalLine) ?? null : null;
    const departureLineData = departureLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == departureLine) ?? null : null;

    return {
      sceneryName,
      sceneryData: sceneryData ?? null,
      arrivalLine: arrivalLine ?? '',
      departureLine: departureLine ?? '',
      arrivalLineData,
      departureLineData,
    };
  });
}

function parseStopListString(stopsString: string) {
  //${stop.arrivalLine ?? ''};${stop.arrivalTimestamp};${stop.stopNameRAW};${stop.stopTime ? stop.stopTime + '_' + stop.stopType : ''};${stop.mainStop};${stop.stopDistance};${stop.departureTimestamp};${stop.departureLine ?? ''}
  return stopsString.split('~~').map((stop) => {
    const [arrivalLine, arrivalTimestamp, stopNameRAW, stopDetails, isMainStop, stopDistance, departureTimestamp, departureLine] = stop.split(';');
    const [stopTime, stopType] = stopDetails.split('_');

    return {
      arrivalLine,
      arrivalTimestamp: parseInt(arrivalTimestamp),
      stopNameRAW,
      stopTime: stopTime ?? 0,
      stopType: stopType ?? null,
      mainStop: isMainStop == 'true',
      stopDistance: parseFloat(stopDistance),
      departureTimestamp: parseInt(departureTimestamp),
      departureLine,
    };
  });
}

function getAbbrevs(routeData: SceneryRoute) {
  const abbrevs = [];

  if (routeData.isRouteSBL == true) abbrevs.push(`${routeData.routeSpeed > 130 ? '4' : ''}S${routeData.routeTracks == 2 ? 'S' : ''}`);
  else if (routeData.routeTracks == 2) abbrevs.push('PP');

  return abbrevs;
}
</script>
