<script setup lang="ts">
import AddTrigger from '~/components/dialog/AddTrigger.vue';
import type { TriggerMessageType } from '~/store/discordMessageTrigger';
import { useDiscordMessagesTriggerStore } from '~/store/discordMessageTrigger';
definePageMeta({
  layout: 'manage',
});

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
  await triggerStore.addTriggerMessage(data);
};
</script>
<template>
  <v-card>
    <v-card-title> 메시지 트리거 관리 </v-card-title>
    <v-card-text>
      <alerts-trigger-message />
      <div class="text-right mt-3">
        <v-btn color="warning" @click="openDialog"> 트리거 추가 </v-btn>
      </div>
    </v-card-text>
    <v-card-text> Table Area </v-card-text>
  </v-card>
  <AddTrigger
    :open="openAddTriggerDialog"
    @input-data="saveTrigger"
    @onClose="closeDialog"
  />
</template>
