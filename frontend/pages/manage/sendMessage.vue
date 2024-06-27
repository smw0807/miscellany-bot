<script setup lang="ts">
import { useDiscordManageStore } from '~/store/discordManage';
import { useDiscordMessagesStore } from '~/store/discordMessages';
import type { ChannelType } from '~/store/discordManage';
import type { SendMessageType } from '~/store/discordMessages';
import type { DiscordGuildsType } from '~/store/discord';

definePageMeta({
  layout: 'manage',
});

const uGuild = useGuild();
const discordManageStore = useDiscordManageStore();
const discordMessageStore = useDiscordMessagesStore();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);
// 채널 리스트
const cChannels = computed<ChannelType[]>(() => discordManageStore.channelList);

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
  (v: string) => v.length <= 5000 || '5000자 이하로 입력해주세요.',
];
const selectChannelRules = [(v: ChannelType) => !!v || '채널을 선택해주세요.'];

// 메시지 전송
const sendMessage = async () => {
  startSendMessage();
  const { valid } = await form.value.validate();
  if (valid) {
    const params: SendMessageType = {
      guildId: guild.value.id,
      channelId: selectChannel.value.id,
      message: message.value,
      isEveryone: isEveryone.value,
    };
    const result = await discordMessageStore.sendMessage(params);
    if (result) message.value = '';
  }

  endSendMessage();
};

const startSendMessage = () => {
  isLoading.value = true;
  disabledTextField.value = true;
};
const endSendMessage = () => {
  isLoading.value = false;
  disabledTextField.value = false;
};

// 메시지 전송 내역
// 테이블 헤더
const headers = [
  { title: '보낸 시간', value: 'createdAt', width: '30%' },
  { title: '채널', value: 'channelName', width: '20%' },
  { title: '메시지', value: 'message', width: '50%' },
];
// 총 개수
const totalItems = computed(() => discordMessageStore.total);
// 테이블 아이템
const items = computed(() => discordMessageStore.sendMessagesHistory);
// 페이지
const page = computed(() => discordMessageStore.pageIndex);
// 페이지 업데이트
const pageUpdate = (value: number) => {
  discordMessageStore.pageIndex = value;
  discordMessageStore.findSendMessageHistory();
};
onMounted(() => {
  guild.value = uGuild.loadGuild();

  discordMessageStore.guildId = guild.value.id;
  discordMessageStore.findSendMessageHistory();
});
</script>
<template>
  <v-card>
    <v-card-title> [{{ guild.name }}] 서버에 메시지 보내기 </v-card-title>
    <v-card-text>
      <alerts-send-message />
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
        <v-textarea
          v-model="message"
          :rules="messageRules"
          clear-icon="mdi-close-circle"
          label="채널에 보낼 메시지를 입력해주세요."
          clearable
          counter
          no-resize
          @keydown.ctrl.enter="sendMessage"
        ></v-textarea>

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
  <v-card class="mt-3">
    <v-card-title class="d-flex">
      메시지 전송 내역
      <v-spacer />
      <div class="text-subtitle-1 text-">총 {{ totalItems }} 개</div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        items-per-page="10"
        density="comfortable"
        hide-default-footer
      ></v-data-table>
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalItems / 10)"
        rounded
        color="primary"
        @update:model-value="pageUpdate"
        class="my-4"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>
