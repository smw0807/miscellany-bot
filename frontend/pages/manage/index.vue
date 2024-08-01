<script setup lang="ts">
definePageMeta({
  layout: 'manage',
});
const config = useRuntimeConfig();
const projectName: Ref<string> = ref(config.public.projectName);
</script>
<template>
  <v-sheet border="md" class="pa-6 text-white mx-auto" color="#141518">
    <h4 class="text-h5 font-weight-bold mb-4">{{ projectName }}</h4>

    <p>
      안녕하세요.
      <br />
      {{ projectName }}은 현재 4가지 기능을 제공하고 있습니다.
      <br />
      <li>디스코드 채팅 번역</li>
      <li>채널로 메시지 보내기</li>
      <li>트리거 메시지</li>
      <li>메시지 전송 예약</li>

      <br />

      1. 디스코드 <b class="text-red">채팅 번역 기능</b>은 이
      <u>관리자 페이지에서 기능을 제공하지 않고</u>, 디스코드 자체에서
      제공됩니다. 디스코드에서 번역하고 싶은 채팅 메시지를 우클릭 해서 [앱]
      메뉴에서 번역하고 싶은 언어를 선택할 수 있습니다.
      <br />
      2. <b class="text-red">채널로 메시지 보내기</b>는 특정 채널로 메시지를
      보낼 수 있는 기능입니다.
      <br />
      3. <b class="text-red">트리거 메시지</b>는 디스코드 채팅방에서 특정
      키워드가 포함된 메시지를 받았을 때, 저장된 메시지를 보내는 기능입니다.
      <br />
      4. <b class="text-red">예약 메시지</b>는 특정 시간에 메시지를 보낼 수 있는
      기능입니다. 1회성으로 전송할 수도 있고, 주기적으로 전송할 수도 있습니다.
    </p>
  </v-sheet>
</template>
