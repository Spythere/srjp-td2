<template>

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
