<script setup lang="ts">
definePageMeta({
  layout: 'error',
});
const route = useRoute();
</script>
<template>
  <v-container class="text-center">
    <v-row>
      <v-col>
        <h1>Error {{ route.params.code }}</h1>
        <p>잠시후에 다시 시도해주세요.</p>
        <v-btn @click="$router.push('/')">
          <v-icon>mdi-home</v-icon>홈으로
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
