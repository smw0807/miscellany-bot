<script setup lang="ts">
definePageMeta({
  layout: 'manage',
});
const config = useRuntimeConfig();
const projectName: Ref<string> = ref(config.public.projectName);
</script>
<template>
  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
    elevation="4"
    height="250"
    max-width="800"
    width="100%"
    rounded
  >
    <div>
      <h2 class="text-h4 font-weight-black text-orange">기능 구성 및 사용법</h2>

      <!-- <div class="text-h5 font-weight-medium mb-2">
        현재 총 3가지 기능으로 구성되어 있습니다.
      </div> -->

      <p class="text-body-2 my-4">총 3가지 기능으로 구성되어 있습니다.</p>

      <v-btn color="orange" variant="text">ㅇㅇ</v-btn>
    </div>
  </v-sheet>
</template>
