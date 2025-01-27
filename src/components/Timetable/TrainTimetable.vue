<template>
  <div class="overflow-auto py-1">
    <b v-if="globalStore.selectedTrain" class="my-2">
      {{ globalStore.selectedTrain.timetable!.category }} {{ globalStore.selectedTrain.trainNo }} Relacja
      {{ globalStore.selectedTrain.timetable?.route.replace('|', ' - ') }}
    </b>

    <table class="table-fixed mt-2 w-full border-collapse" v-if="computedTimetable.length > 0">
      <TimetableHeader />
      <TimetableBody :computed-timetable="computedTimetable" />
    </table>

    <div class="text-center font-bold text-zinc-400 p-2" v-else>Wybierz aktywny pociąg, aby wygenerować SRJP</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import TimetableBody from './TimetableBody.vue';
import TimetableHeader from './TimetableHeader.vue';
import type { StopRow } from '../../types/common.types';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

const computedTimetable = computed(() => {
  if (!globalStore.selectedTrain) return [];

  const timetable = globalStore.selectedTrain.timetable;

  if (!timetable) return [];

  let timeFrom = Date.now();

  const headLocos = globalStore.selectedTrain.stockString
    .split(';')
    .slice(0, 3)
    .filter((s, i) => i == 0 || /-\d+$/.test(s))
    .map((s) => s.slice(0, s.indexOf('-')));

  const stockVmax = 70,
    stockMass = Math.floor(globalStore.selectedTrain.mass / 1000),
    stockLength = globalStore.selectedTrain.length;

  const timetablePath = timetable.path.split(';').map((pathEl) => {
    const [arrivalLine, scenery, departureLine] = pathEl.split(',');
    const sceneryName = scenery.split(' ').slice(0, -1).join(' ');

    const sceneryData = apiStore.sceneryData?.find((sc) => sc.name == sceneryName) ?? null;
    const arrivalLineData = arrivalLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == arrivalLine) ?? null : null;
    const departureLineData = departureLine ? sceneryData?.routesInfo.find((rt) => rt.routeName == departureLine) ?? null : null;

    return {
      sceneryName,
      sceneryData: sceneryData ?? null,
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

  let realLineNo = 0;

  // console.debug('=========== ' + this.selectedTrain.trainNo + ' ===========');

  for (const stop of timetable.stopList) {
    if (stop.arrivalLine && stop.arrivalLine == currentPath.arrivalLine) {
      arrivalKm = stop.stopDistance;

      if (currentPath.arrivalLineData) {
        arrivalSpeed = currentPath.arrivalLineData.routeSpeed;
        arrivalTracks = currentPath.arrivalLineData.routeTracks;
      }

      departureSpeed = arrivalSpeed;
      departureTracks = arrivalTracks;
    }

    if (/^<strong>|, (podg|po)$|^(!_, pe)$/.test(stop.stopName)) {
      let correctedDepartureSpeed = 0,
        correctedDepartureTracks = 0;

      const internalRouteInfo = stop.departureLine
        ? currentPath.sceneryData?.routesInfo.find((route) => route.isInternal && route.routeName == stop.departureLine)
        : undefined;

      if (internalRouteInfo) {
        correctedDepartureSpeed = internalRouteInfo.routeSpeed;
        departureSpeed = internalRouteInfo.routeSpeed;

        correctedDepartureTracks = internalRouteInfo.routeTracks;
        departureTracks = internalRouteInfo.routeTracks;
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
        realLine: realLineNo == 0 ? ' - ' : realLineNo.toString(),
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
          stopRows[i].realLine = currentPath.departureLineData.realLineNo?.toString() ?? ' - ';

          if (stopRows[i].isMain || stopRows[i].pointName.endsWith(', podg')) {
            stopRows[i].departureSpeed = currentPath.departureLineData.routeSpeed;
            stopRows[i].departureTracks = currentPath.departureLineData.routeTracks;
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
</script>
