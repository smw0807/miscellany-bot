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
const config = useRuntimeConfig();

const projectName: Ref<string> = ref(config.public.projectName);

const login = async () => {
  const result = await $fetch('/api/auth/discord/login');
  window.location.href = result as string;
};
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center" cols="6">
        <v-card variant="tonal">
          <v-card-title
            >{{ projectName }}<br />관리자 페이지 로그인</v-card-title
          >
          <v-card-text>
            <v-btn color="red" variant="elevated" @click="login">
              디스코드 아이디로 로그인하기
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
