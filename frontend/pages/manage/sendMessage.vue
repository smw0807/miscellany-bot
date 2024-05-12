<script setup lang="ts">
import { useDiscordManageStore } from '~/store/discordManage';
import type { ChannelType, SendMessageType } from '~/store/discordManage';
import type { DiscordGuildsType } from '~/store/discord';

definePageMeta({
  layout: 'manage',
});
const config = useRuntimeConfig();
const uGuild = useGuild();
const discordStore = useDiscordManageStore();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);
// 채널 리스트
const cChannels = computed<ChannelType[]>(() => discordStore.channelList);

const form = ref();
// 메시지 입력
const message: Ref<string> = ref('');
// @everyone 적용 여부
const isEveryone: Ref<boolean> = ref(true);
// 선택한 채널
const selectChannel = ref();
// 로딩 여부(메시지 전송 중 활성화)
const isLoading: Ref<boolean> = ref(false);
// 텍스트 필드 비활성화 여부(메시지 전송 중 활성화)
const disabledTextField: Ref<boolean> = ref(false);

// 유효성검사
const messageRules = [
  (v: string) => !!v || '메시지를 입력해주세요.',
  (v: string) => v.length <= 500 || '5000자 이하로 입력해주세요.',
];
const selectChannelRules = [(v: ChannelType) => !!v || '채널을 선택해주세요.'];

// 메시지 전송
const sendMessage = async () => {
  startSendMessage();
  const { valid } = await form.value.validate();
  if (!valid) {
    endSendMessage();
    return;
  }
  const params: SendMessageType = {
    guildId: guild.value.id,
    channelId: selectChannel.value.id,
    message: message.value,
    isEveryone: isEveryone.value,
  };
  const result = await discordStore.sendMessage(params);
  if (!result) {
    alert('메시지 전송에 실패했습니다.');
  }
  form.value.reset();
  endSendMessage();
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
      <v-form ref="form">
        <v-row justify="center" align="center">
          <v-col cols="5" ms="12">
            <v-checkbox
              v-model="isEveryone"
              label="@everyone 적용"
              hide-details
              :disabled="disabledTextField"
            ></v-checkbox>
          </v-col>
          <v-col cols="7" ms="12">
            <v-select
              v-model="selectChannel"
              :rules="selectChannelRules"
              :items="cChannels"
              item-title="name"
              item-value="id"
              return-object
              density="compact"
              label="메시지 보낼 채널을 선택해주세요."
              no-data-text="메시지 전송 가능한 채널이 없습니다."
              hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-text-field
          v-model="message"
          :disabled="disabledTextField"
          label="메시지"
          outlined
          clearable
          dense
          rows="5"
          placeholder="메시지를 입력하세요."
          :rules="messageRules"
        ></v-text-field>

        <v-btn
          @click="sendMessage"
          prepend-icon="mdi-send"
          color="primary"
          dark
          block
          :loading="isLoading"
        >
          보내기
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
