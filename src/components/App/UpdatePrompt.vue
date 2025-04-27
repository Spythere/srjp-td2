<template>
  <div class="fixed z-50 bottom-0 right-0">
    <button @click="onUpdateClick" class="p-3 m-3 bg-cyan-600 rounded-md text-xl" ref="updateBtnEl">
      <div>{{ $t('update-prompt.line1') }}</div>
      <u>{{ $t('update-prompt.line2') }}</u>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';

const emit = defineEmits(['onUpdateClick']);
const updateBtnEl = ref<HTMLElement | null>(null);

function onUpdateClick() {
  emit('onUpdateClick');
}

onMounted(() => {
  updateBtnEl.value?.focus();
});
</script>
