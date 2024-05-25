<script setup lang="ts">
import { useDialogStore } from '~/store/dialog';
const store = useDialogStore();
const isShow = computed(() => !!store.alertDialog);
const confirm = () => {
  store.closeAlert();
};
const alertData = computed(() => store.alertDialog);
const icon = computed(() => {
  if (alertData?.value?.type === 'success') {
    return 'mdi-check-circle';
  } else if (alertData?.value?.type === 'error') {
    return 'mdi-alert-circle';
  } else if (alertData?.value?.type === 'info') {
    return 'mdi-information-variant-circle';
  } else if (alertData?.value?.type === 'warning') {
    return 'mdi-alert';
  }
});
</script>
<template>
  <v-sheet>
    <v-dialog v-model="isShow" max-width="400" persistent>
      <v-sheet
        class="pa-4 text-center mx-auto"
        elevation="12"
        max-width="600"
        rounded="lg"
        width="100%"
      >
        <v-icon
          class="mb-5"
          :color="alertData?.type"
          :icon="icon"
          size="100"
        ></v-icon>

        <h2 class="text-h5 mb-6">{{ alertData?.title ?? '' }}</h2>

        <pre
          v-html="alertData?.message ?? ''"
          class="mb-4 text-medium-emphasis text-body-2"
        ></pre>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">
          <v-btn
            class="text-none"
            :color="alertData?.type"
            variant="flat"
            width="90"
            rounded
            @click="confirm"
          >
            {{ alertData?.btnText ?? '확인' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>
  </v-sheet>
</template>
