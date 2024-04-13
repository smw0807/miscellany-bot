<script setup lang="ts">
/**
 * /api/auth/discord/login으로 요청을 보내면 디스코드 로그인 페이지로 이동할 URL을 받음
 * 해당 URL로 이동 후 디스코들 로그인을 정상적으로 완료하면 /auth로 redirect됨
 */
import { ref } from 'vue';
import type { Ref } from 'vue';

definePageMeta({
  layout: 'login',
});

const { hasToken } = useAuth();
const router = useRouter();
// 토큰정보가 있으면 이전 페이지로 이동
if (hasToken()) {
  router.go(-1);
}
const config = useRuntimeConfig();

const projectName: Ref<string> = ref(config.public.projectName);

const login = async () => {
  const result = await $fetch('/api/auth/discord/login');
  window.location.href = result as string;
};
</script>
<template>
  <v-sheet
    border="md"
    class="pa-6 text-white mx-auto"
    color="#141518"
    max-width="450"
  >
    <h4 class="text-h4 text-center font-weight-bold mb-4">{{ projectName }}</h4>

    <p class="mb-5">
      환영합니다. <br />
      {{ projectName }} 관리자 페이지를 이용하기 위해선 [디스코드] 계정으로
      로그인해야 합니다. <br />
      로그인 후 현재 관리중인 디스코드 채널들을 확인할 수 있고, <br />
      {{ projectName }} 봇을 추가했다면 추가적인 기능들을 이용하실 수
      있습니다.<br />
      추가되어 있지 않다면 봇을 추가하실 수 있습니다.
    </p>

    <v-btn
      class="text-none"
      color="indigo-darken-1"
      size="x-large"
      variant="flat"
      block
      @click="login"
    >
      로그인하기
    </v-btn>
  </v-sheet>
</template>
