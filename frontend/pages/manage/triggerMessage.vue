<script setup lang="ts">
import EditTrigger from '~/components/dialog/EditTrigger.vue';
import type { DiscordGuildsType } from '~/store/discord';
import type {
  TriggerMessagesDataType,
  TriggerMessageType,
} from '~/store/discordMessageTrigger';
import { useDiscordMessagesTriggerStore } from '~/store/discordMessageTrigger';
import { EditTypeEnum, ResultTypeEnum } from '~/types/enums';
definePageMeta({
  layout: 'manage',
});

const config = useRuntimeConfig();
const { loadGuild } = useGuild();
const { useAlert } = useDialog();

// 서버 정보
const guild: Ref<DiscordGuildsType> = ref({} as DiscordGuildsType);

const triggerStore = useDiscordMessagesTriggerStore();

// 트리거 다이얼로그 오픈
const openEditTriggerDialog = ref(false);
// 트리거 다이얼로그 모드
const editMode = ref<EditTypeEnum>(EditTypeEnum.ADD);
// 트리거 다이얼로그 열기
const openDialog = () => {
  editMode.value = EditTypeEnum.ADD;
  openEditTriggerDialog.value = true;
};
// 트리거 다이얼로그 닫기
const closeDialog = () => {
  openEditTriggerDialog.value = false;
};
// 트리거 저장
const saveTrigger = async (mode: EditTypeEnum, data: TriggerMessageType) => {
  const guild = loadGuild(config.public.discordStorageName);
  const params = {
    guildId: guild.id,
    ...data,
  };
  let result = false;
  if (mode === EditTypeEnum.ADD) {
    result = await triggerStore.addTriggerMessage(params);
  } else if (mode === EditTypeEnum.EDIT) {
    // 기존 데이터와 변경된 데이터가 같은지 체크
    if (
      rowItem.value?.triggerWord === data.triggerWord &&
      rowItem.value?.message === data.message
    ) {
      return await useAlert({
        type: ResultTypeEnum.INFO,
        title: '트리거 수정',
        message: '변경된 내용이 없습니다.',
      });
    }
    result = await triggerStore.updateTriggerMessage(
      rowItem.value?.id!,
      params
    );
  } else {
    console.warn('DELETE MODE NOT SUPPORTED');
  }
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
// 총 데이터 개수
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
// 로우 데이터
const rowItem = ref<TriggerMessagesDataType>();
// 테이블 로우 클릭 이벤트
const rowClickEvent = (
  _e: Event,
  { item }: { item: TriggerMessagesDataType }
) => {
  rowItem.value = item;
  editMode.value = EditTypeEnum.EDIT;
  openEditTriggerDialog.value = true;
};

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
        <v-btn
          :disabled="selectedTrigger.length === 0"
          color="red"
          class="ml-1"
          @click="deleteTrigger"
        >
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
        @click:row="rowClickEvent"
        show-select
        items-per-page="10"
        density="comfortable"
        hide-default-footer
      >
        <template #item.message="{ item }">
          {{
            item.message.length > 10
              ? item.message.slice(0, 10) + '...'
              : item.message
          }}
        </template>
      </v-data-table>
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

  <EditTrigger
    :open="openEditTriggerDialog"
    :mode="editMode"
    :editData="rowItem"
    @input-data="saveTrigger"
    @onClose="closeDialog"
  />
</template>
