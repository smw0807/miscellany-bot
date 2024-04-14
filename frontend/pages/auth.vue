<script setup lang="ts">
/**
 * 로그인 페이지에서 디스코드 로그인 후 정상적으로 통과하면 이 페이지로 옴.
 * 이 페이지로 올 때 code, state를 url query로 받아오게 됨
 * 이 페이지에서는 code, state를 이용하여 token을 요청하고 정상적으로 받아오면
 * 로그인이 완료된 것으로 간주하고 메인 페이지로 이동하게 됨
 *
 * 이렇게 처리한 이유는 url상에 code, state를 노출시키지 않기 위해 이 페이지를 거쳐가게 함
 */
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '~/store/auth';

definePageMeta({
  layout: 'login',
});

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const authStore = useAuthStore();

// 토큰정보가 있으면 이전 페이지로 이동
if (auth.hasToken()) {
  router.push('/');
}

// 디스코드로부터 받은 code
const code = route.query.code as string;
const state = route.query.state as string;
if (!code && !state) {
  console.warn('code, state 없음');
  router.push('/login');
}

// 요청 처리 상태
const isFinished: Ref<boolean> = ref(false);
// 에러 여부
const isError: Ref<boolean> = ref(false);

const iconName: Ref<string> = ref('mdi-check-circle');
const iconColor: Ref<string> = ref('success');

// 토큰 정보 요청
const requestDiscordToken = async () => {
  try {
    const result = await authStore.discordToken(code, state);
    auth.saveToken(result);
    setTimeout(() => router.push('/'), 13000);
  } catch (e) {
    isError.value = true;
    iconName.value = 'mdi-close-circle';
    iconColor.value = 'error';
  }
  isFinished.value = true;
};
requestDiscordToken();

// 로그인 페이지로 이동
const login = () => {
  router.replace('/login');
};
</script>
<template>
  <v-sheet
    class="pa-4 text-center mx-auto"
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
  >
    <v-progress-circular
      v-if="!isFinished"
      :size="100"
      color="primary"
      class="mb-5"
      indeterminate
    ></v-progress-circular>
    <v-icon
      v-else
      class="mb-5"
      :color="iconColor"
      :icon="iconName"
      size="112"
    ></v-icon>

    <div v-if="isError">
      <h2 class="text-h5 mb-3">로그인에 실패했습니다.</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">
        다시 로그인을 시도해주세요.
        <br />
        아래 버튼을 클릭하면 다시 로그인 페이지로 이동합니다.
      </p>
    </div>
    <div v-else>
      <h2 class="text-h5 mb-3">로그인 인증 중입니다.</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">
        인증이 완료되면 메인 페이지로 이동합니다.
        <br />
        잠시만 기다려주세요!
      </p>
    </div>

    <!-- 인증 실패 시 다시 로그인 하도록 버튼 활성화 -->
    <div class="text-end" v-if="isError">
      <v-divider class="mb-4"></v-divider>
      <v-btn
        class="text-none"
        color="indigo-darken-1"
        variant="flat"
        @click="login"
      >
        다시 로그인하기
      </v-btn>
    </div>
  </v-sheet>
</template>
