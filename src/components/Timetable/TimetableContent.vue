<template>
  <div>
    <h2 class="p-1 font-bold w-max">
      {{ globalStore.currentTimetableData!.category }}
      {{ globalStore.currentTimetableData!.trainNo }} {{ $t('headers.relation') }}
      {{ globalStore.currentTimetableData!.route.replace('|', ' - ') }}
    </h2>

    <table class="table-fixed mt-2 w-full border-collapse" v-if="computedTimetableRows.length > 0">
      <thead>
        <tr>
          <th width="40" class="border border-black dark:border-white">
            {{ $t('headers.line_no') }}
          </th>
          <th width="100" class="border border-black dark:border-white">
            {{ $t('headers.line_km') }}
          </th>
          <th width="35" class="border border-black dark:border-white">V<sub>P</sub></th>
          <th width="35" class="border border-black dark:border-white">V<sub>L</sub></th>
          <th width="200" class="border border-black dark:border-white">
            {{ $t('headers.station') }}
          </th>
          <th width="100" class="border border-black dark:border-white">
            {{ $t('headers.time') }}
          </th>
          <th width="50" class="border border-black dark:border-white text-xs p-0">
            <table class="h-full w-full border-collapse">
              <tbody>
                <tr class="border-b border-b-black dark:border-b-white">
                  <td class="">{{ $t('headers.loco_1') }}</td>
                </tr>
                <tr class="border-b border-b-black dark:border-b-white">
                  <td>{{ $t('headers.loco_2') }}</td>
                </tr>
                <tr>
                  <td>{{ $t('headers.loco_3') }}</td>
                </tr>
              </tbody>
            </table>
          </th>
          <th width="55" class="border border-black dark:border-white text-xs relative">
            <div class="absolute top-0 left-0 w-full h-full">
              <table class="h-full w-full border-collapse">
                <tbody>
                  <tr class="border-b border-b-black dark:border-b-white">
                    <td>{{ $t('headers.mass') }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('headers.length') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </th>
          <th width="50" class="border border-black dark:border-white">{{ $t('headers.vmax') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, i) in computedTimetableRows">
          <!-- Line no. -->
          <td
            class="text-center align-top border-l border-l-black dark:border-l-white"
            :class="{
              'border-t border-t-black dark:border-t-white':
                row.lastRowRef != null && row.lastRowRef.realLine != row.realLine,
              'border-b border-b-black dark:border-b-white': i == computedTimetableRows.length - 1
            }"
          >
            {{
              row.lastRowRef == null || row.lastRowRef.realLine != row.realLine
                ? row.realLine
                : '&nbsp;'
            }}
          </td>

          <!-- Km -->
          <td
            class="border border-black dark:border-white border-t-1 border-b-1 relative p-0"
            :class="{
              'border-t-0':
                row.lastRowRef == null ||
                (row.lastRowRef.departureSpeedL == row.arrivalSpeedL &&
                  row.lastRowRef.departureSpeedP == row.arrivalSpeedP &&
                  row.lastRowRef.departureTracks == row.arrivalTracks &&
                  row.lastRowRef.realLine == row.realLine),
              'border-b-0': i != computedTimetableRows.length - 1
            }"
          >
            <div class="absolute top-0 left-0 w-full h-full">
              <table class="h-full w-full border-collapse">
                <tbody>
                  <!-- Arrival Km -->
                  <tr
                    :class="`align-top ${
                      row.lastRowRef == null ||
                      (row.lastRowRef.departureSpeedL == row.arrivalSpeedL &&
                        row.lastRowRef.departureSpeedP == row.arrivalSpeedP &&
                        row.lastRowRef.departureTracks == row.arrivalTracks &&
                        row.lastRowRef.realLine == row.realLine)
                        ? 'text-transparent'
                        : 'text-inherit'
                    }`"
                  >
                    <td>{{ row.arrivalKm }}</td>
                  </tr>

                  <!-- Departure Km -->
                  <tr
                    :class="{
                      'border-black dark:border-white border-t align-top':
                        row.arrivalTracks != row.departureTracks ||
                        row.departureSpeedL != row.arrivalSpeedL ||
                        row.departureSpeedP != row.arrivalSpeedP,
                      hidden:
                        row.arrivalTracks == row.departureTracks &&
                        row.departureSpeedL == row.arrivalSpeedL &&
                        row.departureSpeedP == row.arrivalSpeedP
                    }"
                  >
                    <td>{{ row.departureKm == '0.000' ? '' : row.departureKm }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>

          <!--  Vp, Vl -->
          <td
            class="text-center align-top p-0 border-l-black dark:border-l-white relative"
            :class="{
              'border-t border-t-black dark:border-t-white':
                row.lastRowRef != null &&
                row.lastRowRef.departureSpeedL != row.arrivalSpeedL &&
                row.lastRowRef.departureSpeedP != row.arrivalSpeedP,
              'border-b border-b-black dark:border-b-white': i == computedTimetableRows.length - 1
            }"
            colspan="2"
          >
            <div class="absolute top-0 left-0 w-full h-full">
              <table class="h-full w-full border-collapse">
                <tbody>
                  <tr class="align-top">
                    <td :colspan="row.arrivalTracks == 2 ? '1' : '2'" class="font-bold" width="35">
                      {{
                        row.lastRowRef == null ||
                        row.lastRowRef.departureSpeedP != row.arrivalSpeedP ||
                        row.lastRowRef.departureTracks != row.arrivalTracks
                          ? row.arrivalSpeedP
                          : '&nbsp; '
                      }}
                    </td>

                    <td
                      v-if="row.arrivalTracks == 2"
                      class="border-l border-l-black dark:border-l-white"
                      width="35"
                    >
                      {{
                        row.lastRowRef == null ||
                        row.lastRowRef.departureSpeedL != row.arrivalSpeedL ||
                        row.lastRowRef.departureTracks != row.arrivalTracks
                          ? row.arrivalSpeedL
                          : '&nbsp; '
                      }}
                    </td>
                  </tr>

                  <tr
                    :class="{
                      'border-t border-t-black dark:border-t-white align-top':
                        row.arrivalTracks != row.departureTracks ||
                        row.departureSpeedL != row.arrivalSpeedL ||
                        row.departureSpeedP != row.arrivalSpeedP
                    }"
                  >
                    <td
                      :colspan="row.departureTracks == 2 ? '1' : '2'"
                      class="font-bold"
                      width="35"
                    >
                      {{
                        row.departureSpeedP != row.arrivalSpeedP ||
                        row.departureTracks != row.arrivalTracks
                          ? row.departureSpeedP
                          : '&nbsp; '
                      }}
                    </td>

                    <td
                      v-if="row.departureTracks == 2"
                      class="border-l border-l-black dark:border-l-white"
                      width="35"
                    >
                      {{
                        row.departureSpeedL != row.arrivalSpeedL ||
                        row.departureTracks != row.arrivalTracks
                          ? row.departureSpeedL
                          : '&nbsp; '
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>

          <!-- Station -->
          <td class="border border-black dark:border-white relative">
            <div class="absolute top-0 left-0 w-full h-full">
              <div class="flex flex-col h-full justify-between p-1">
                <div :class="{ 'font-bold': row.isMain }">
                  {{ row.pointName }}
                  <span v-if="row.stopTime"> ; {{ row.stopType || 'pt' }}</span>
                </div>

                <div class="flex justify-between">
                  <span>{{ row.pointKm }}</span>
                  <span>{{ row.abbrevs.join(', ') }}</span>
                </div>
              </div>
            </div>
          </td>

          <!-- Time -->
          <td class="p-0 border border-black dark:border-white relative">
            <div class="absolute top-0 left-0 w-full h-full">
              <table class="h-full w-full border-collapse">
                <tbody>
                  <tr class="text-center align-top h-full">
                    <td
                      class="border-r-[1px] border-r-black dark:border-r-white"
                      :class="{ 'font-bold': row.stopTime > 0 }"
                    >
                      {{
                        (row.scheduledArrivalDate?.getTime() || 0) !=
                        (row.scheduledDepartureDate?.getTime() || 0)
                          ? row.scheduledArrivalDate?.toLocaleTimeString('pl-PL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '|'
                      }}
                    </td>
                    <td width="30">{{ row.driveTime ? Math.floor(row.driveTime / 60000) : '' }}</td>
                  </tr>
                  <tr class="text-center align-bottom h-full">
                    <td
                      class="border-r-[1px] border-r-black dark:border-r-white"
                      :class="{ 'font-bold': row.stopTime > 0 }"
                    >
                      {{
                        row.scheduledDepartureDate?.toLocaleTimeString('pl-PL', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }}
                    </td>
                    <td width="30" class="font-bold">{{ row.stopTime || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>

          <!-- Locos -->
          <td
            class="p-0 text-center border border-black dark:border-white relative h-24 text-sm"
            :class="{ 'text-stone-400 ': i > 0 }"
          >
            <table class="h-full w-full border-collapse">
              <tbody>
                <tr class="border-b-[1px] border-b-black dark:border-b-white">
                  <td>{{ row.headUnits[0] }}</td>
                </tr>
                <tr class="border-b-[1px] border-b-black dark:border-b-white">
                  <td>{{ row.headUnits[1] ?? '&nbsp;' }}</td>
                </tr>
                <tr>
                  <td>{{ row.headUnits[2] ?? '&nbsp;' }}</td>
                </tr>
              </tbody>
            </table>
          </td>

          <!-- Load / Length -->
          <td
            class="p-0 text-center border border-black dark:border-white relative"
            :class="{ 'text-stone-400 ': i > 0 }"
          >
            <div class="absolute top-0 left-0 w-full h-full">
              <table class="h-full w-full border-collapse">
                <tbody>
                  <tr class="border-b-[1px] border-b-black dark:border-b-white">
                    <td>{{ Math.floor(row.stockMass / 1000) }}</td>
                  </tr>
                  <tr>
                    <td>{{ row.stockLength }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>

          <!-- Vmax-->
          <td
            class="text-center border border-black dark:border-white"
            :class="{ 'text-stone-400 ': i > 0 }"
          >
            {{ row.stockVmax }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-2">
      <b><u>Kursuje:</u></b>
      <div>
        - {{ parseTimetableRunDate(computedTimetableRows[0].scheduledDepartureDate!) }}
        <span
          v-if="computedTimetableRows[computedTimetableRows.length - 1].scheduledArrivalDate!.getDate() != computedTimetableRows[0].scheduledDepartureDate!.getDate()"
        >
          -
          {{
            parseTimetableRunDate(
              computedTimetableRows[computedTimetableRows.length - 1].scheduledArrivalDate!
            )
          }}
        </span>
      </div>

      <div v-if="timetableWarnings.length != 0">
        <b><u>Uwagi do rozkładu:</u></b>
        <div>- {{ timetableWarnings }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useApiStore } from '../../stores/api.store';
import { useGlobalStore } from '../../stores/global.store';
import type { SceneryRoute, StopRow, TimetablePathData } from '../../types/common.types';
import { parseTimetableRunDate } from '../../utils/dateUtils';

const globalStore = useGlobalStore();
const apiStore = useApiStore();

// Tymczasowa tabelka z posterunkami APO
const apoNames = ['Stary Kisielin, pe', 'Czerwony Dwór, pe', 'Szczejkowice, pe'];

const timetableWarnings = computed(() => {
  const timetableData = globalStore.currentTimetableData;

  if (!timetableData) return '';

  return timetableData.warningNotes;
});

const computedTimetableRows = computed(() => {
  const timetableData = globalStore.currentTimetableData;

  if (!timetableData) return [];

  let timeFrom = Date.now();

  const stockVmax = timetableData.trainMaxSpeed,
    stockMass = timetableData.mass,
    stockLength = timetableData.length;

  const timetablePath = parseTimetablePath(timetableData.path);

  const stopRows: StopRow[] = [];

  let lastRowRef: StopRow | null = null;

  let currentPathIndex = 0;
  let currentPath = timetablePath[0];

  let lastDepartureTimestamp = 0;

  let arrivalSpeedL = 0,
    arrivalSpeedP = 0;

  let departureSpeedL = 0,
    departureSpeedP = 0;

  let arrivalKm = 0,
    arrivalTracks = 0,
    departureTracks = 2,
    realLineNo = 0,
    abbrevs = [] as string[];

  if (currentPath.departureLineData) {
    departureSpeedL = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);
    departureSpeedP = currentPath.departureLineData.routeSpeedExit
      ? Math.min(currentPath.departureLineData.routeSpeedExit, stockVmax)
      : departureSpeedL;

    // departureSpeed = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);
    departureTracks = currentPath.departureLineData.routeTracks;

    // arrivalSpeed = departureSpeed;

    arrivalSpeedL = departureSpeedL;
    arrivalSpeedP = departureSpeedP;

    arrivalTracks = departureTracks;

    realLineNo = currentPath.departureLineData?.realLineNo ?? 0;
    abbrevs = getAbbrevs(currentPath.departureLineData);
  }

  // console.debug('=========== ' + timetableData.trainNo + ' ===========');

  const stopList = parseStopListString(timetableData.stopListString);

  for (const stop of stopList) {
    if (stop.arrivalLine && stop.arrivalLine == currentPath.arrivalLine) {
      if (arrivalKm >= stop.stopDistance)
        arrivalKm =
          (Number(stopRows[stopRows.length - 1].departureKm ?? '0') + stop.stopDistance) / 2;

      if (currentPath.arrivalLineData) {
        arrivalSpeedP = Math.min(currentPath.arrivalLineData.routeSpeed, stockVmax);
        arrivalSpeedL = currentPath.arrivalLineData.routeSpeedExit
          ? Math.min(currentPath.arrivalLineData.routeSpeedExit, stockVmax)
          : arrivalSpeedP;

        arrivalTracks = currentPath.arrivalLineData.routeTracks;
        realLineNo = currentPath.arrivalLineData.realLineNo ?? 0;
        abbrevs = getAbbrevs(currentPath.arrivalLineData);
      }

      departureSpeedL = arrivalSpeedL;
      departureSpeedP = arrivalSpeedP;

      departureTracks = arrivalTracks;
    }

    if (
      stop.mainStop ||
      (/^podg|po|pe$/.test(stop.stopNameRAW) && !/^sbl/i.test(stop.stopNameRAW))
    ) {
      let correctedDepartureSpeedL = 0,
        correctedDepartureSpeedP = 0,
        correctedDepartureTracks = 0;

      const internalRouteInfo = stop.departureLine
        ? currentPath.sceneryData?.routesInfo.find(
            (route) => route.isInternal && route.routeName == stop.departureLine
          )
        : undefined;

      if (internalRouteInfo) {
        correctedDepartureSpeedL = Math.min(internalRouteInfo.routeSpeed, stockVmax);
        correctedDepartureSpeedP = internalRouteInfo.routeSpeedExit
          ? Math.min(internalRouteInfo.routeSpeedExit, stockVmax)
          : correctedDepartureSpeedL;

        departureSpeedL = correctedDepartureSpeedL;
        departureSpeedP = correctedDepartureSpeedP;

        realLineNo = internalRouteInfo.realLineNo ?? realLineNo;
        abbrevs = getAbbrevs(internalRouteInfo);

        correctedDepartureTracks = internalRouteInfo.routeTracks;
        departureTracks = internalRouteInfo.routeTracks;

        if (stopRows.length == 0) {
          arrivalSpeedL = departureSpeedL;
          arrivalSpeedP = departureSpeedP;
          arrivalTracks = departureTracks;
        }
      }

      let pointAbbrevs = [];
      if (apoNames.includes(stop.stopNameRAW))
        pointAbbrevs.unshift(`APO ${currentPath.sceneryData?.abbr}`);

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

        abbrevs: [...pointAbbrevs, ...abbrevs],

        arrivalKm: arrivalKm.toFixed(3),
        departureKm: stop.stopDistance.toFixed(3),

        arrivalSpeedL,
        arrivalSpeedP,

        arrivalTracks: arrivalTracks,

        departureSpeedL,
        departureSpeedP,

        departureTracks: departureTracks,

        headUnits: timetableData.headUnits,
        stockVmax,
        stockLength,
        stockMass,

        lastRowRef
      };

      // console.debug(stop.stopNameRAW, stop.departureLine);

      arrivalKm = stop.stopDistance;

      arrivalSpeedL = correctedDepartureSpeedL || arrivalSpeedL;
      arrivalSpeedP = correctedDepartureSpeedP || arrivalSpeedP;

      arrivalTracks = correctedDepartureTracks || arrivalTracks;

      if (stop.departureTimestamp) lastDepartureTimestamp = stop.departureTimestamp;
      lastRowRef = rowData;

      stopRows.push(rowData);
    }

    if (stop.departureLine && stop.departureLine == currentPath.departureLine) {
      arrivalKm = stop.stopDistance;

      // Reverse search for last scenery checkpoint
      if (currentPath.departureLineData) {
        if (
          currentPath.departureLineData.routeLength != 0 &&
          !currentPath.departureLineData.isRouteSBL
        )
          arrivalKm = stop.stopDistance + currentPath.departureLineData.routeLength / 1000;

        if (
          stopRows[stopRows.length - 1].isMain &&
          currentPath.departureLineData.isRouteSBL &&
          stop.departureLine == currentPath.departureLine
        )
          arrivalKm = stop.stopDistance + currentPath.departureLineData.routeLength / 1000;

        for (let i = stopRows.length - 1; i >= 0; i--) {
          stopRows[i].departureTracks = currentPath.departureLineData.routeTracks;

          stopRows[i].departureSpeedL = Math.min(
            currentPath.departureLineData.routeSpeed,
            stockVmax
          );

          stopRows[i].departureSpeedP = currentPath.departureLineData.routeSpeedExit
            ? Math.min(currentPath.departureLineData.routeSpeedExit, stockVmax)
            : stopRows[i].departureSpeedL;

          stopRows[i].realLine = currentPath.departureLineData.realLineNo?.toString() ?? '';

          if (stopRows[i].isMain || stopRows[i].pointName.endsWith(', podg')) {
            stopRows[i].departureSpeedL = Math.min(
              currentPath.departureLineData.routeSpeed,
              stockVmax
            );

            stopRows[i].departureSpeedP = currentPath.departureLineData.routeSpeedExit
              ? Math.min(currentPath.departureLineData.routeSpeedExit, stockVmax)
              : stopRows[i].departureSpeedL;

            stopRows[i].departureTracks = currentPath.departureLineData.routeTracks;

            // console.log(
            //   stop.departureLine,
            //   currentPath.sceneryName,
            //   stop.stopDistance,
            //   currentPath.departureLineData.routeLength,
            //   currentPath.departureLineData.isRouteSBL
            // );

            /* 
            if (currentPath.departureLineData.isRouteSBL)
              arrivalKm = stop.stopDistance + (currentPath.departureLineData.routeSpeed <= 130 ? 1.0 : 2.0);
            else */

            abbrevs = getAbbrevs(currentPath.departureLineData);
            stopRows[i].abbrevs = abbrevs;
            break;
          }

          stopRows[i].arrivalSpeedP = Math.min(currentPath.departureLineData.routeSpeed, stockVmax);
          stopRows[i].arrivalSpeedL = currentPath.departureLineData.routeSpeedExit
            ? Math.min(currentPath.departureLineData.routeSpeedExit, stockVmax)
            : stopRows[i].arrivalSpeedP;
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

function getAbbrevs(routeData: SceneryRoute) {
  const abbrevs = [];

  if (routeData.isRouteSBL == true)
    abbrevs.push(
      `${routeData.routeSpeed > 130 ? '4' : ''}S${routeData.routeTracks == 2 ? 'S' : ''}`
    );
  else if (routeData.routeTracks == 2) abbrevs.push('PP');

  return abbrevs;
}
</script>

<style scoped>
@media print {
  th,
  tr,
  td {
    border-color: theme('colors.black');
  }

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
