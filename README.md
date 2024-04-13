# MiscellanyBOT

디스코드 봇들을 몇 가지 사용해봤는데 무료로는 기능 제한이 많은 것들이 많아서 직접 만들어보고자 시작함.
만들어보고 싶은 기능들을 구현해볼 예정

프론트엔드는 디스코드 봇 기능을 사용하기 위한 관리자 페이지 구현 예정  
예: 예약메시지 등록, 특정 단어 트리거 기능, 특정 메시지 반복(스케줄링)

백엔드는 디스코드 메시지 언어 번역, 프론트엔드에서 등록한 기능을 실행하는 기능 구현 예정.

[2024-03-17] 시작

# 기술 스택

- NodeJS [21.6.1]

## Front-End

- NuxtJS [3.10.3]
- Vuetify [3.5.13]

## Back-End

- NestJS [10.3.2]
- Discord.js [14.14.1]
- @supabase/supabase-js [2.42.0]

# 참고 URL

1. Discord.js
   - https://discord.com/developers/docs/intro
   - https://discordjs.guide/
   - https://discord.js.org/docs/packages/discord.js/14.14.1
   - OAuth2
     - https://discord.com/developers/docs/topics/oauth2
     - CSRF 공격 방지에 대한 내용
       - https://discord.com/developers/docs/topics/oauth2#state-and-security
2. Google Cloud
   - https://console.cloud.google.com/apis/dashboard?hl=ko
   1. Google Translate
      - https://cloud.google.com/translate/docs/setup?hl=ko
      - v2 버전과 v3 비교 설명 (https://cloud.google.com/translate/docs/editions?hl=ko)
        - 디스코드 채팅 내용을 번역할 예정이기 때문에 v2를 선택함
3. NuxtJS
   - https://nuxt.com/docs/getting-started/introduction
   - Proxy 관련(Nitro RouteRules)
     - https://nitro.unjs.io/config#routerules
     - https://jongmin4943.tistory.com/entry/Nuxt3-proxy-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0feat-Spring-API-%EC%84%9C%EB%B2%84
4. supabase
   - https://supabase.com/docs
   - https://supabase.com/docs/guides/api
5. Vuetify3
   - https://vuetifyjs.com/en/
   - color
     - https://vuetifyjs.com/en/styles/colors/#material-colors
   - sheet
     - https://vuetifyjs.com/en/components/sheets/#usage
6. pinia
   - https://pinia.vuejs.org/
