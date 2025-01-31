<template>
  <thead>
    <tr>
      <th width="40" class="border border-black dark:border-white">{{ $t('headers.line_no') }}</th>
      <th width="100" class="border border-black dark:border-white">{{ $t('headers.line_km') }}</th>
      <th width="35" class="border border-black dark:border-white">V<sub>P</sub></th>
      <th width="35" class="border border-black dark:border-white">V<sub>L</sub></th>
      <th width="200" class="border border-black dark:border-white">{{ $t('headers.station') }}</th>
      <th width="100" class="border border-black dark:border-white">{{ $t('headers.time') }}</th>
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
</template>

<style scoped>
@media print {
  th, tr {
    border-color: theme('colors.black');
  }
}
</style>
