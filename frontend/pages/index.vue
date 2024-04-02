<script setup lang="ts">
//pinia test
import { useStore } from '@/store';

const store = useStore();
</script>
<template>
  <v-col> test : {{ store.count }}</v-col>
</template>
