<script setup lang="ts">
import type { TriggerMessageType } from '~/store/discordMessageTrigger';
import { ResultTypeEnum } from '~/types/enums';

const props = defineProps<{
  open: boolean;
}>();

const { useConfirm } = useDialog();

const emit = defineEmits({
  'input-data': (data: TriggerMessageType) => true,
  onClose: () => true,
});

const form = ref();
// @everyone 여부
const isEveryone: Ref<boolean> = ref(true);
// 트리거할 단어
const triggerWord = ref<string>('');
// 유효성검사
const triggerWordRules = [
  (v: string) => !!v || '트리거할 단어를 입력해주세요.',
];
// 발송할 메시지
const message = ref<string>('');
// 유효성검사
const messageRules = [
  (v: string) => !!v || '메시지를 입력해주세요.',
  (v: string) => v.length <= 1000 || '1000자 이하로 입력해주세요.',
];
// 저장
const emitSave = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const confirm = await useConfirm({
    type: ResultTypeEnum.INFO,
    title: '트리거 추가',
    message: '트리거를 추가하시겠습니까?',
  });
  if (confirm) {
    const dataForm: Ref<TriggerMessageType> = ref({
      isEveryone: isEveryone.value,
      triggerWord: triggerWord.value,
      message: message.value,
    });
    emit('input-data', dataForm.value);
    form.value.reset();
  }
};
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
        <h2 class="text-h5 mb-2">트리거 추가</h2>
        <v-form ref="form">
          <!-- @everyon 여부 -->
          <v-checkbox
            v-model="isEveryone"
            label="@everyone 적용"
            hide-details
          ></v-checkbox>

          <!-- 트리거할 단어 입력  -->
          <v-text-field
            v-model="triggerWord"
            :rules="triggerWordRules"
            label="트리거할 단어"
            outlined
            placeholder="트리거할 단어를 입력해주세요."
            required
          />

          <!-- 발송할 메시지 입력 -->
          <v-textarea
            v-model="message"
            :rules="messageRules"
            clear-icon="mdi-close-circle"
            label="채널에 보낼 메시지를 입력해주세요."
            clearable
            counter
            no-resize
          ></v-textarea>
        </v-form>
        <v-divider class="mb-4"></v-divider>
        <div class="text-end">
          <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            rounded
            @click="emitSave"
            >저장</v-btn
          >
          <v-btn rounded @click="emit('onClose')">닫기</v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
