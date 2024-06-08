<script setup lang="ts">
import AddTrigger from '~/components/dialog/AddTrigger.vue';
import type { DiscordGuildsType } from '~/store/discord';
import type { TriggerMessageType } from '~/store/discordMessageTrigger';
import { useDiscordMessagesTriggerStore } from '~/store/discordMessageTrigger';
definePageMeta({
  layout: 'manage',
});

const config = useRuntimeConfig();
const { loadGuild } = useGuild();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

const triggerStore = useDiscordMessagesTriggerStore();

const openAddTriggerDialog = ref(false);

// 트리거 추가 다이얼로그 열기
const openDialog = () => {
  openAddTriggerDialog.value = true;
};
// 트리거 추가 다이얼로그 닫기
const closeDialog = () => {
  openAddTriggerDialog.value = false;
};
// 트리거 저장
const saveTrigger = async (data: TriggerMessageType) => {
  const guild = loadGuild(config.public.discordStorageName);
  const params = {
    guildId: guild.id,
    ...data,
  };
  const result = await triggerStore.addTriggerMessage(params);
  if (result) closeDialog();
};

// 트리거 삭제 이벤트
const deleteTrigger = async () => {
  await triggerStore.deleteTriggerMessage(selectedTrigger.value);
};

// 트리거 메시지 리스트 관련
// 테이블 헤더
const headers = [
  { title: '트리거 단어', value: 'triggerWord' },
  { title: '메시지', value: 'message' },
  { title: '생성일', value: 'createdAt' },
  { title: '수정일', value: 'updatedAt' },
];
// 데이터
const items = computed(() => triggerStore.triggerMessages);
// 총 ㄷ[ㅇ;타 개수
const totalItems = computed(() => triggerStore.total);
// 현재 페이지 번호
const page = ref(triggerStore.pageIndex);
// 페이지 넘버 클릭 시 이벤트
const pageUpdate = (value: number) => {
  triggerStore.pageIndex = value;
  triggerStore.getTriggerMessages();
  // 페이지 변경 시 체크박스 초기화
  selectedTrigger.value = [];
};
// 테이블 체크박스 선택 값
const selectedTrigger = ref<string[]>([]);

onMounted(() => {
  guild.value = loadGuild(config.public.discordStorageName);

  triggerStore.guildId = guild.value.id;
  triggerStore.getTriggerMessages();
});
</script>
<template>
  <v-card>
    <v-card-title> 트리거 메시지 관리 </v-card-title>
    <v-card-text>
      <alerts-trigger-message />
      <div class="text-right mt-3">
        <v-btn color="warning" @click="openDialog"> 트리거 추가 </v-btn>
        <v-btn color="red" class="ml-1" @click="deleteTrigger">
          트리거 삭제
        </v-btn>
      </div>
    </v-card-text>
    <v-card-title class="d-flex">
      <span>메시지 전송 내역</span>
      <v-spacer />
      <div class="text-subtitle-1 text-">총 {{ totalItems }} 개</div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        v-model="selectedTrigger"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        show-select
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
  <AddTrigger
    :open="openAddTriggerDialog"
    @input-data="saveTrigger"
    @onClose="closeDialog"
  />
</template>
