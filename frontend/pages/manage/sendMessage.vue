<script setup lang="ts">
import type { DiscordGuildsType } from '~/store/discord';

definePageMeta({
  layout: 'manage',
});
const config = useRuntimeConfig();
const uGuild = useGuild();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

const message: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const disabledTextField: Ref<boolean> = ref(false);

const sendMessage = async () => {
  startSendMessage();
  // todo 서버에 메시지 보내기 API 호출
  setTimeout(() => {
    endSendMessage();
  }, 5000);
  console.log(message.value);
};

const startSendMessage = () => {
  isLoading.value = true;
  disabledTextField.value = true;
};
const endSendMessage = () => {
  isLoading.value = false;
  disabledTextField.value = false;
  message.value = '';
};

onMounted(() => {
  guild.value = uGuild.loadGuild(config.public.discordStorageName);
});
</script>
<template>
  <v-card>
    <v-card-title> [{{ guild.name }}] 서버에 메시지 보내기 </v-card-title>
    <v-card-text>
      <v-checkbox label="@everyone 적용" hide-details></v-checkbox>
      <v-text-field
        v-model="message"
        :disabled="disabledTextField"
        label="메시지"
        outlined
        clearable
        dense
        rows="5"
        placeholder="메시지를 입력하세요."
        :rules="[(v: string) => !!v || '메시지를 입력하세요.']"
      ></v-text-field>

      <v-btn
        @click="sendMessage"
        color="primary"
        dark
        block
        :loading="isLoading"
      >
        보내기
      </v-btn>
    </v-card-text>
  </v-card>
</template>