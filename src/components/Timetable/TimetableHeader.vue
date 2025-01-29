<template>
  <thead>
    <tr>
      <th width="40" class="border border-black dark:border-white">Nr <br />linii</th>
      <th width="100" class="border border-black dark:border-white">Km</th>
      <th width="35" class="border border-black dark:border-white">V<sub>P</sub></th>
      <th width="35" class="border border-black dark:border-white">V<sub>L</sub></th>
      <th width="200" class="border border-black dark:border-white">Stacja</th>
      <th width="100" class="border border-black dark:border-white">Godzina</th>
      <th width="50" class="border border-black dark:border-white text-xs p-0">
        <table class="h-full w-full border-collapse">
          <tbody>
            <tr class="border-b-black dark:border-b-white border-b">
              <td class="">Lok I</td>
            </tr>
            <tr class="border-b-black dark:border-b-white border-b">
              <td>Lok II</td>
            </tr>
            <tr>
              <td>Lok III</td>
            </tr>
          </tbody>
        </table>
      </th>
      <th width="55" class="border border-black dark:border-white text-xs relative">
        <div class="absolute top-0 left-0 w-full h-full">
          <table class="h-full w-full border-collapse">
            <tbody>
              <tr class="border-b-black dark:border-b-white border-b k">
                <td>Obc. lok.</td>
              </tr>
              <tr>
                <td>Dł. poc.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </th>
      <th width="50" class="border border-black dark:border-white">Vmax</th>
    </tr>
  </thead>
</template>

<style scoped>
@media print {
  th {
    border-color: theme('colors.black');
  }
}
</style>
