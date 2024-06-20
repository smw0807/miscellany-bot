<script setup lang="ts">
definePageMeta({
  layout: 'manage',
});
const totalItems = ref(0);
</script>
<template>
  <v-card>
    <v-card-title> 예약 메시지 관리 </v-card-title>
    <v-card-text>
      <div class="text-right mt-3">
        <v-btn color="warning"> 예약 메시지 추가 </v-btn>
        <v-btn color="red" class="ml-1"> 예약 메시지 삭제</v-btn>
      </div>
    </v-card-text>

    <v-card-title class="d-flex">
      <span>등록된 트리거</span>
      <v-spacer />
      <div class="text-subtitle-1 text-">총 {{ totalItems }} 개</div>
    </v-card-title>
  </v-card>
</template>
