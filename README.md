# MiscellanyBOT

디스코드 봇...  
프론트엔드는 디스코드 봇 기능을 사용하기 위한 관리자 페이지 구현 예정  
예: 예약메시지 등록, 특정 단어 트리거 기능, 특정 메시지 반복(스케줄링)  
백엔드는 디스코드 메시지 언어 번역, 프론트엔드에서 등록한 기능을 실행하는 기능 구현 예정.

만든 이유: 디스코드 봇들을 몇 가지 사용해봤는데 무료로는 기능 제한이 많은 것들이 많아서 직접 만들어보고자 시작함.

[2024-03-17] 시작

# 기술 스택

- NodeJS [21.6.1]

## Front-End

- NuxtJS [3.10.3]

## Back-End

- NestJS [10.3.2]
- Discord.js [14.14.1]

# 참고 URL

1. Discord.js
   - https://discord.com/developers/docs/intro
   - https://discord.js.org/docs/packages/discord.js/14.14.1
2. Google Cloud
   - https://console.cloud.google.com/apis/dashboard?hl=ko
   1. Google Translate
      - https://cloud.google.com/translate/docs/setup?hl=ko
      - v2 버전과 v3 비교 설명 (https://cloud.google.com/translate/docs/editions?hl=ko)
        - 디스코드 채팅 내용을 번역할 예정이기 때문에 v2를 선택함
3. NuxtJS
   - https://nuxt.com/docs/getting-started/introduction
4. supabase
   - https://supabase.com/docs
   - https://supabase.com/docs/guides/api
   - Login with discord
     - https://supabase.com/docs/guides/auth/social-login/auth-discord
