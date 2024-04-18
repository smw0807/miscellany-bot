<script setup lang="ts">
import { useDiscordStore, type DiscordGuildsType } from '~/store/discord';

const config = useRuntimeConfig();
const projectName: Ref<string> = ref(config.public.projectName);

const router = useRouter();

const { hasToken } = useAuth();
if (hasToken()) {
  const discordStore = useDiscordStore();
  // 관리중인 서버 목록 조회 요청
  const getGuilds = async () => {
    await discordStore.requestGuilds();
  };

  onMounted(async () => {
    if (discordStore.guilds.length === 0) {
      await getGuilds();
    }
  });
} else {
  // 토큰이 없을 경우 로그인 페이지로 이동

  console.warn('로그인이 필요합니다.');
  router.push('/login');
}

// 현재 페이지 이름
const currentPageName = computed(() => router.currentRoute.value.name);
</script>
<template>
  <v-layout class="rounded rounded-md">
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

    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>
