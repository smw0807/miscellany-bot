<script setup lang="ts">
const { hasToken } = useAuth();
// 토큰이 없을 경우 로그인
if (!hasToken()) {
  const router = useRouter();
  console.warn('로그인이 필요합니다.');
  router.push('/login');
}
</script>
<template>
  <slot />
</template>
