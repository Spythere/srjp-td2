<template>
  <div>
    <h2 class="font-semibold text-center text-3xl">
      {{ globalStore.currentTimetableData!.category }}
      {{ globalStore.currentTimetableData!.trainNo }}
    </h2>

    <h3 class="font-medium text-center">
      {{ globalStore.currentTimetableData!.route.replace('|', ' - ') }}
    </h3>

    <p class="mt-2 text-center">
      Platí: {{ timetableDate.toLocaleDateString('pl-PL', { day: '2-digit' }) }}.{{
        romanMonthDigits[timetableDate.getMonth()]
      }}.{{ timetableDate.toLocaleDateString('pl-PL', { year: 'numeric' }) }}
    </p>

    <p class="mt-2">
      Elektrická lokomotiva ř. {{ globalStore.currentTimetableData!.headUnits[0] }}: normativ
      hmotnosti: S {{ (globalStore.currentTimetableData!.mass / 1000).toFixed(0) }} tun.
    </p>

    <p>
      Vlak brzděn {{ globalStore.currentTimetableData!.mass > 500000 ? 'II' : 'I' }} způsobem brzdění.
    </p>

    <table class="table-fixed w-full border-collapse h-full">
      <thead>
        <tr>
          <!-- Name  -->
          <th
            width="300"
            class="font-normal border border-black dark:border-white border-l-transparent"
          >
            1
          </th>

          <!-- Info -->
          <th width="50" class="font-normal border border-black dark:border-white">2</th>

          <!-- Drive time -->
          <th width="30" class="font-normal border border-black dark:border-white">3</th>

          <!-- Arrival -->
          <th width="70" class="font-normal border border-black dark:border-white">5</th>

          <!-- Stop time -->
          <th width="40" class="font-normal border border-black dark:border-white">6</th>

          <!-- Departure -->
          <th width="70" class="font-normal border border-black dark:border-white">7</th>

          <!-- vMax -->
          <th
            width="80"
            class="font-normal border border-black dark:border-white border-r-transparent"
          >
            8
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, i) in computedTimetableRows"
          :class="{ 'bg-slate-100 dark:bg-zinc-900': i % 2 == 0 }"
          class="leading-none"
        >
          <td class="px-2 font-thin text-nowrap overflow-hidden overflow-ellipsis">
            <span :class="{ 'font-semibold': row.isMain, 'font-normal': !row.isMain }">
              {{ row.pointName }}</span
            ><span
              >.............................................................................................
            </span>
          </td>

          <td
            class="border border-black dark:border-white border-t-transparent border-b-transparent"
          ></td>

          <td
            class="border border-black dark:border-white border-t-transparent border-b-transparent text-center font-bold"
          >
            {{ row.driveTime ? Math.floor(row.driveTime / 60000) : '' }}
          </td>

          <td
            class="border border-black dark:border-white border-t-transparent border-b-transparent text-right font-bold px-2"
          >
            <span v-if="row.stopType == 'pt'">+</span>
            {{
              row.scheduledArrivalDate
                ?.toLocaleTimeString('pl-PL', {
                  hour: 'numeric',
                  minute: '2-digit'
                })
                .split(':')
                .slice(
                  i > 0 &&
                    computedTimetableRows[i - 1].scheduledArrivalDate?.getHours() ==
                      row.scheduledArrivalDate.getHours()
                    ? 1
                    : 0
                )
                .join(' ')
            }}
          </td>

          <td
            class="border border-black dark:border-white border-t-transparent border-b-transparent text-center font-semibold"
          >
            {{ row.stopTime || '' }}
          </td>

          <td
            class="border border-black dark:border-white border-t-transparent border-b-transparent text-right font-bold px-2"
          >
            {{
              row.scheduledDepartureDate
                ?.toLocaleTimeString('pl-PL', {
                  hour: 'numeric',
                  minute: '2-digit'
                })
                .split(':')
                .slice(
                  i > 0 &&
                    computedTimetableRows[i - 1].scheduledDepartureDate?.getHours() ==
                      row.scheduledDepartureDate.getHours()
                    ? 1
                    : 0
                )
                .join(' ')
            }}
          </td>

          <td class="text-center font-bold">
            <span
              v-if="
                i == 0 || (i > 0 && computedTimetableRows[i - 1].departureSpeed != row.arrivalSpeed)
              "
              >{{ row.arrivalSpeed }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import type { StopRowCZ, TimetablePathData } from '../../types/common.types';
import { useApiStore } from '../../stores/api.store';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

const timetableDate = ref(new Date());
const headUnit = ref('');

const romanMonthDigits = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const computedTimetableRows = computed(() => {
  const timetableData = globalStore.currentTimetableData;

  if (!timetableData) return [];

  let timeFrom = Date.now();

  const stockVmax = timetableData.trainMaxSpeed,
    stockMass = Math.floor(timetableData.mass / 1000),
    stockLength = timetableData.length;

  const timetablePath = parseTimetablePath(timetableData.path);

  const stopRows: StopRowCZ[] = [];

  let currentPathIndex = 0;
  let currentPath = timetablePath[0];

  let lastDepartureTimestamp = 0;

  let arrivalSpeed = 0,
    departureSpeed = 0;

  if (currentPath.departureLineData) {
    departureSpeed = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);

    arrivalSpeed = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);
  }

  const stopList = parseStopListString(timetableData.stopListString);

  timetableDate.value = new Date(stopList[0].departureTimestamp);

  for (const stop of stopList) {
    if (stop.arrivalLine && stop.arrivalLine == currentPath.arrivalLine) {
      if (currentPath.arrivalLineData) {
        arrivalSpeed = Math.min(currentPath.arrivalLineData.routeSpeed, stockVmax);
      }

      departureSpeed = arrivalSpeed;
    }

    if (
      stop.mainStop ||
      (/^podg|po|pe$/.test(stop.stopNameRAW) && !/^sbl/i.test(stop.stopNameRAW))
    ) {
      let correctedDepartureSpeed = 0;

      const internalRouteInfo = stop.departureLine
        ? currentPath.sceneryData?.routesInfo.find(
            (route) => route.isInternal && route.routeName == stop.departureLine
          )
        : undefined;

      if (internalRouteInfo) {
        correctedDepartureSpeed = Math.min(internalRouteInfo.routeSpeed, stockVmax);
        departureSpeed = Math.min(internalRouteInfo.routeSpeed, stockVmax);

        if (stopRows.length == 0) {
          arrivalSpeed = departureSpeed;
        }
      }

      let rowData: StopRowCZ = {
        isMain: stop.mainStop,
        pointKm: stop.stopDistance.toFixed(3),
        pointName: stop.stopNameRAW,
        scheduledArrivalDate: stop.arrivalTimestamp ? new Date(stop.arrivalTimestamp) : null,
        scheduledDepartureDate: stop.departureTimestamp ? new Date(stop.departureTimestamp) : null,
        stopTime: stop.stopTime ? (stop.departureTimestamp - stop.arrivalTimestamp) / 60000 : 0,
        stopType: stop.stopType,
        sceneryName: currentPath.sceneryName,
        driveTime: lastDepartureTimestamp ? stop.arrivalTimestamp - lastDepartureTimestamp : 0,

        arrivalSpeed: arrivalSpeed,

        departureSpeed: departureSpeed,

        headUnits: timetableData.headUnits,
        stockVmax,
        stockLength,
        stockMass
      };

      arrivalSpeed = correctedDepartureSpeed || arrivalSpeed;

      if (stop.departureTimestamp) lastDepartureTimestamp = stop.departureTimestamp;

      stopRows.push(rowData);
    }

    if (stop.departureLine && stop.departureLine == currentPath.departureLine) {
      // Reverse search for last scenery checkpoint
      if (currentPath.departureLineData) {
        for (let i = stopRows.length - 1; i >= 0; i--) {
          stopRows[i].departureSpeed = Math.min(
            currentPath.departureLineData.routeSpeed,
            stockVmax
          );

          if (stopRows[i].isMain || stopRows[i].pointName.endsWith(', podg')) {
            stopRows[i].departureSpeed = Math.min(
              currentPath.departureLineData.routeSpeed,
              stockVmax
            );

            break;
          }

          stopRows[i].arrivalSpeed = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);
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
    const arrivalLineData = arrivalLine
      ? sceneryData?.routesInfo.find((rt) => rt.routeName == arrivalLine) ?? null
      : null;
    const departureLineData = departureLine
      ? sceneryData?.routesInfo.find((rt) => rt.routeName == departureLine) ?? null
      : null;

    return {
      sceneryName,
      sceneryData: sceneryData ?? null,
      arrivalLine: arrivalLine ?? '',
      departureLine: departureLine ?? '',
      arrivalLineData,
      departureLineData
    };
  });
}

function parseStopListString(stopsString: string) {
  //${stop.arrivalLine ?? ''};${stop.arrivalTimestamp};${stop.stopNameRAW};${stop.stopTime ? stop.stopTime + '_' + stop.stopType : ''};${stop.mainStop};${stop.stopDistance};${stop.departureTimestamp};${stop.departureLine ?? ''}
  return stopsString.split('~~').map((stop) => {
    const [
      arrivalLine,
      arrivalTimestamp,
      stopNameRAW,
      stopDetails,
      isMainStop,
      stopDistance,
      departureTimestamp,
      departureLine
    ] = stop.split(';');
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
      departureLine
    };
  });
}
</script>

<style scoped></style>
