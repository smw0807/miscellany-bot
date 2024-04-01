<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

const login = () => {
  console.log('login');
};
</script>
<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="login"
              >디스코드 계정으로 로그인하기</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
