<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    time: string;
    open: boolean;
    label: string;
  }>(),
  {
    time: '',
    open: false,
    label: 'Time',
  }
);
const emit = defineEmits(['close']);

const open = ref(props.open);
const time = ref(props.time);
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
      >
      </v-time-picker>
    </v-menu>
  </v-text-field>
</template>
