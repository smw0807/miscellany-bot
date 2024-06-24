<script setup lang="ts">
import { EditTypeEnum, ScheduleType } from '~/types/enums';
import type { ChannelType } from '~/store/discordManage';
const props = withDefaults(
  defineProps<{
    open: boolean;
    mode?: EditTypeEnum;
    channels?: ChannelType[];
  }>(),
  {
    open: false,
    mode: EditTypeEnum.ADD,
  }
);
const emit = defineEmits({
  onClose: () => true,
});

const form = ref();
// @everyone 여부
const isEveryone = ref<boolean>(true);
// 예약 메시지 타입
const scheduleType = ref<ScheduleType>(ScheduleType.ONETIME);
// 예약 메시지 전송할 채널
const selectedChannel = ref<ChannelType>();
// 예약 메시지 제목
const title = ref<string>('');
// 예약 메시지 내용
const message = ref<string>('');
</script>
<template>
  <v-sheet>
    <v-dialog v-model="props.open" @close="emit('onClose')" persistent>
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <h2 class="text-h5 mb-2">
          예약 메시지 {{ props.mode === 'add' ? '추가' : '수정' }}
        </h2>
        <alerts-edit-schedule-message />
        <v-form ref="form">
          <!-- @everyone 여부 -->
          <v-checkbox
            v-model="isEveryone"
            label="@everyone 적용"
            hide-details
          ></v-checkbox>

          <!-- 예약 메시지 타입 -->
          <v-radio-group v-model="scheduleType" inline hide-details>
            <v-radio label="1번 전송" :value="ScheduleType.ONETIME"></v-radio>
            <v-radio
              label="반복 전송"
              :value="ScheduleType.RECURRING"
            ></v-radio>
          </v-radio-group>

          <!-- 예약 메시지 전송 채널 -->
          <v-select
            v-model="selectedChannel"
            :items="props.channels"
            label="예약 메시지 발송할 채널"
            item-text="name"
            item-value="id"
            return-object
          ></v-select>

          <!-- 예약 메시지 제목 -->
          <v-text-field v-model="title" label="예약 메시지 제목"></v-text-field>

          <!-- 예약 메시지 내용 -->
          <v-textarea
            v-model="message"
            clear-icon="mdi-close-circle"
            label="채널에 보낼 메시지를 입력해주세요."
            clearable
            counter
            no-resize
          ></v-textarea>
        </v-form>

        <!-- 1번 전송일 때, 보낼 시간 -->

        <!-- 반복 전송일 때, 반복 주기 -->

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-btn class="text-none" color="primary" variant="flat" rounded
            >저장</v-btn
          >
          <v-btn rounded @click="emit('onClose')">닫기</v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
