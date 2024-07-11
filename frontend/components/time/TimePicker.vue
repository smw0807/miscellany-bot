<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string;
    open: boolean;
    label: string;
  }>(),
  {
    modelValue: '',
    open: false,
    label: 'Time',
  }
);
const emit = defineEmits(['close', 'update:modelValue']);

const open = ref(props.open);
const time = ref(props.modelValue);
</script>
<template>
  <v-text-field v-model="time" :active="open" :label="props.label" readonly>
    <v-menu
      v-model="open"
      :close-on-content-click="false"
      activator="parent"
      transition="scale-transition"
    >
      <v-time-picker
        v-if="open"
        v-model="time"
        color="green-lighten-1"
        full-width
        @update:model-value="emit('update:modelValue', time)"
      >
      </v-time-picker>
    </v-menu>
  </v-text-field>
</template>
