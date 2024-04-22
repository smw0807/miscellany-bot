<script setup lang="ts">
const config = useRuntimeConfig();
const projectName: Ref<string> = ref(config.public.projectName);

const router = useRouter();
// 현재 페이지 이름
const currentPageName = computed(() => router.currentRoute.value.name);
</script>
<template>
  <v-app-bar>
    <v-avatar class="mx-3">
      <v-img src="/logo.png" alt="logo" />
    </v-avatar>
    <span class="text-h5">{{ projectName }}</span>
    <v-spacer />

    <!-- 관리 화면일 때만 활성화 -->
    <template v-slot:append>
      <v-btn
        v-if="currentPageName === 'manage'"
        prepend-icon="mdi-home"
        @click="router.push('/')"
      >
        홈으로
      </v-btn>
    </template>
  </v-app-bar>
</template>
