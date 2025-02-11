<template>
  <tbody>
    <tr v-for="(row, i) in computedTimetable">
      <td
        class="text-center align-top border-l border-l-black dark:border-l-white"
        :class="{
          'border-t border-t-black dark:border-t-white': i != 0 && computedTimetable[i - 1].realLine != row.realLine,
          'border-b border-b-black dark:border-b-white': i == computedTimetable.length - 1,
        }"
      >
        {{ i == 0 || computedTimetable[i - 1].realLine != row.realLine ? row.realLine : '&nbsp;' }}
      </td>

      <td
        class="border border-black dark:border-white border-t-1 border-b-1 relative p-0"
        :class="{
          'border-t-0':
            i == 0 ||
            (computedTimetable[i - 1].departureSpeed == row.arrivalSpeed &&
              computedTimetable[i - 1].departureTracks == row.arrivalTracks &&
              computedTimetable[i - 1].realLine == row.realLine),
          'border-b-0': i != computedTimetable.length - 1,
        }"
      >
        <div class="absolute top-0 left-0 w-full h-full">
          <table class="h-full w-full border-collapse">
            <tbody>
              <tr
                :class="`align-top ${
                  i == 0 ||
                  (computedTimetable[i - 1].departureSpeed == row.arrivalSpeed &&
                    computedTimetable[i - 1].departureTracks == row.arrivalTracks &&
                    computedTimetable[i - 1].realLine == row.realLine)
                    ? 'text-transparent'
                    : 'text-inherit'
                }`"
              >
                <td>{{ row.arrivalKm }}</td>
              </tr>
              <tr
                :class="{
                  'border-black dark:border-white  border-t align-top':
                    row.arrivalTracks != row.departureTracks || row.departureSpeed != row.arrivalSpeed,
                  hidden: row.arrivalTracks == row.departureTracks && row.departureSpeed == row.arrivalSpeed,
                }"
              >
                <td>{{ row.departureKm == '0.000' ? '' : row.departureKm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>

      <td
        class="text-center align-top p-0 border-l-black dark:border-l-white relative"
        :class="{
          'border-t border-t-black dark:border-t-white': i != 0 && computedTimetable[i - 1].departureSpeed != row.arrivalSpeed,
          'border-b border-b-black dark:border-b-white': i == computedTimetable.length - 1,
        }"
        colspan="2"
      >
        <div class="absolute top-0 left-0 w-full h-full">
          <table class="h-full w-full border-collapse">
            <tbody>
              <tr class="align-top">
                <td :colspan="row.arrivalTracks == 2 ? '1' : '2'" class="font-bold" width="35">
                  {{
                    i == 0 ||
                    computedTimetable[i - 1].departureSpeed != row.arrivalSpeed ||
                    computedTimetable[i - 1].departureTracks != row.arrivalTracks
                      ? row.arrivalSpeed
                      : '&nbsp; '
                  }}
                </td>
                <td v-if="row.arrivalTracks == 2" class="border-l border-l-black dark:border-l-white" width="35">
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
                  'border-t border-t-black dark:border-t-white align-top':
                    row.arrivalTracks != row.departureTracks || row.departureSpeed != row.arrivalSpeed,
                }"
              >
                <td :colspan="row.departureTracks == 2 ? '1' : '2'" class="font-bold" width="35">
                  {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp; ' }}
                </td>

                <td v-if="row.departureTracks == 2" class="border-l border-l-black dark:border-l-white" width="35">
                  {{ row.departureSpeed != row.arrivalSpeed || row.departureTracks != row.arrivalTracks ? row.departureSpeed : '&nbsp; ' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>

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

      <td class="p-0 border border-black dark:border-white relative">
        <div class="absolute top-0 left-0 w-full h-full">
          <table class="h-full w-full border-collapse">
            <tbody>
              <tr class="text-center align-top h-full">
                <td class="border-r-[1px] border-r-black dark:border-r-white" :class="{ 'font-bold': row.stopTime > 0 }">
                  {{
                    (row.scheduledArrivalDate?.getTime() || 0) != (row.scheduledDepartureDate?.getTime() || 0)
                      ? row.scheduledArrivalDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
                      : '|'
                  }}
                </td>
                <td width="30">{{ row.driveTime ? Math.floor(row.driveTime / 60000) : '' }}</td>
              </tr>
              <tr class="text-center align-bottom h-full">
                <td class="border-r-[1px] border-r-black dark:border-r-white" :class="{ 'font-bold': row.stopTime > 0 }">
                  {{ row.scheduledDepartureDate?.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) }}
                </td>
                <td width="30" class="font-bold">{{ row.stopTime || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>

      <td class="p-0 text-center border border-black dark:border-white relative h-24 text-sm" :class="{ 'text-stone-400 ': i > 0 }">
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

      <td class="p-0 text-center border border-black dark:border-white relative" :class="{ 'text-stone-400 ': i > 0 }">
        <div class="absolute top-0 left-0 w-full h-full">
          <table class="h-full w-full border-collapse">
            <tbody>
              <tr class="border-b-[1px] border-b-black dark:border-b-white">
                <td>{{ row.stockMass }}</td>
              </tr>
              <tr>
                <td>{{ row.stockLength }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>

      <td class="text-center border border-black dark:border-white" :class="{ 'text-stone-400 ': i > 0 }">{{ row.stockVmax }}</td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { StopRow } from '../../types/common.types';

defineProps({
  computedTimetable: {
    type: Object as PropType<StopRow[]>,
    required: true,
  },
});
</script>

<style scoped>
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

  tr,
  td {
    border-color: theme('colors.black');
  }
}
</style>
