<template>
  <v-alert dense border="start" border-color="info" class="mt-2">
    <v-row>
      <v-col class="text-left">
        <span>
          - 메시지는 1000자 이하로 입력해주세요.
          <br />
          - 특정 단어 입력 시 발송할 메시지를 작성해주세요.
          <br />
          - !는 자동으로 입력되며 단어만 입력해주시기 바랍니다.
          <br />
          - 입력한 트리거 메시지는 모든 채널에 적용됩니다.
          <br />
          - @everyone 적용 시 모든 유저에게 알림이 전송됩니다.
          <br />
          - 등록 후 디스코드에서 사용할 때는 !단어 형식으로 입력해주세요.
        </span>
      </v-col>
    </v-row>
  </v-alert>
</template>
