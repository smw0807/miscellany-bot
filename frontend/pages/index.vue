<script setup lang="ts">
import { onMounted } from 'vue';
//pinia test
import { useStore } from '@/store';

const store = useStore();

// 관리중인 길드 리스트 조회 요청
const getList = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie(config.public.accessTokenName);

    const result = await $fetch('/api/discord/guilds', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  getList();
});
</script>
<template>
  <v-col> test : {{ store.count }}</v-col>
</template>
