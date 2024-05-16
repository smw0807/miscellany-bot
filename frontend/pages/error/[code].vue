<script setup lang="ts">
definePageMeta({
  layout: 'error',
});
const route = useRoute();
</script>
<template>
  <div>
    <h1>에러 페이지</h1>
    <p>에러 코드: {{ route.params.code }}</p>
    <v-btn @click="$router.back()">뒤로 가기</v-btn>
  </div>
</template>
