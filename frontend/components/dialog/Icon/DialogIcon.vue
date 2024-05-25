<script setup lang="ts">
import { ResultTypeEnum } from '~/types/enums';
const props = defineProps<{ type: ResultTypeEnum; size?: string }>();
const icon = computed(() => {
  if (props?.type === 'success') {
    return 'mdi-check-circle';
  } else if (props?.type === 'error') {
    return 'mdi-alert-circle';
  } else if (props?.type === 'info') {
    return 'mdi-information-variant-circle';
  } else if (props?.type === 'warning') {
    return 'mdi-alert';
  }
});
</script>
<template>
  <v-icon
    class="mb-5"
    :color="props?.type"
    :icon="icon"
    :size="props.size ?? '100'"
  ></v-icon>
</template>
