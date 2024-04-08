<script setup lang="ts">
/**
 * 로그인 페이지에서 디스코드 로그인 후 정상적으로 통과하면 이 페이지로 옴.
 * 이 페이지로 올 때 code, state를 url query로 받아오게 됨
 * 이 페이지에서는 code, state를 이용하여 token을 요청하고 정상적으로 받아오면
 * 로그인이 완료된 것으로 간주하고 메인 페이지로 이동하게 됨
 *
 * 이렇게 처리한 이유는 url상에 code, state를 노출시키지 않기 위해 이 페이지를 거쳐가게 함
 */
definePageMeta({
  layout: 'login',
});

const route = useRoute();
const router = useRouter();
const auth = useAuth();

// 디스코드로부터 받은 code
const code = route.query.code;
const state = route.query.state;
if (!code && !state) {
  console.warn('code, state 없음');
  router.push('/login');
}
// 토큰 정보 요청
const requestDiscordToken = async () => {
  try {
    const result = await $fetch<DiscordTokenType>('/api/auth/discord/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        code,
        state,
      },
    });
    auth.saveToken(result);
    router.push('/');
  } catch (e) {
    console.error(e);
    router.push('/login');
  }
};
requestDiscordToken();
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center" cols="6">
        <v-card variant="tonal">
          <v-card-title>디스코드 인증 확인 중</v-card-title>
          <v-card-text> 잠시만 기다려주세요.... </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
