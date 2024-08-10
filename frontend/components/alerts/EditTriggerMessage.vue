<template>
  <v-alert dense border="start" border-color="info" class="mt-2">
    <v-row>
      <v-col class="text-left">
        <span>
          - 메시지는 1000자 이하로 입력해주세요.
          <br />
          - 특정 단어 입력 시 발송할 메시지를 작성해주세요.
          <br />
          - 첫 단어를 !로 시작해야 정상적으로 작동합니다.
          <br />
          - 입멱된 트리거 메시지는 모든 채널에 적용됩니다.
          <br />
          - @everyone 적용 시 모든 유저에게 알림이 전송됩니다.
          <br />
          - 트리거 단어는 앞에 !를 붙이는걸 권장합니다.
        </span>
      </v-col>
    </v-row>
  </v-alert>
</template>
