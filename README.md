# MiscellanyBOT

디스코드 봇들을 몇 가지 사용해봤는데 무료로는 기능 제한이 많은 것들이 많아서 직접 만들어보고자 시작함.

## 구현 기능

1. 디스코드 로그인
2. 디스코드 봇 추가 기능
3. 추가된 봇으로 사용할 수 있는 기능

- 언어 번역 기능(Google Translate)
- 채널로 메시지 보내기 기능
  - supabase에 보낸 메시지 히스토리 저장
- 메시지 트리거 기능
  - supabase에 트리거 단어 저장해서 사용
- 예약 메시지 기능
  - supabase에 예약 메시지를 저장해서 사용

# 기술 스택

- NodeJS [21.6.1]

## Front-End

- NuxtJS [3.10.3]
- Vuetify3 [3.5.13]
- pinia [2.1.7]

## Back-End

- NestJS [10.3.2]
- Discord.js [14.14.1]
- @supabase/supabase-js [2.42.0]

# 참고 URL

1. Discord.js
   - https://discordjs.guide/
   - https://discord.js.org/docs/packages/discord.js/14.14.1
2. 디스코드 공식문서
   - https://discord.com/developers/docs/intro
   - OAuth2
     - https://discord.com/developers/docs/topics/oauth2
     - OAuth2 허용 범위
     - https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
     - CSRF 공격 방지에 대한 내용
       - https://discord.com/developers/docs/topics/oauth2#state-and-security
3. Google Cloud
   - https://console.cloud.google.com/apis/dashboard?hl=ko
   1. Google Translate
      - https://cloud.google.com/translate/docs/setup?hl=ko
      - v2 버전과 v3 비교 설명 (https://cloud.google.com/translate/docs/editions?hl=ko)
        - 디스코드 채팅 내용을 번역할 예정이기 때문에 v2를 선택함
4. NuxtJS
   - https://nuxt.com/docs/getting-started/introduction
   - Proxy 관련(Nitro RouteRules)
     - https://nitro.unjs.io/config#routerules
     - https://jongmin4943.tistory.com/entry/Nuxt3-proxy-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0feat-Spring-API-%EC%84%9C%EB%B2%84
5. supabase
   - https://supabase.com/docs
   - https://supabase.com/docs/guides/api
6. Vuetify3
   - https://vuetifyjs.com/en/
   - color
     - https://vuetifyjs.com/en/styles/colors/#material-colors
   - sheet
     - https://vuetifyjs.com/en/components/sheets/#usage
7. pinia
   - https://pinia.vuejs.org/
8. ETC
   - https://stackoverflow.com/questions/69501363/discord-api-view-guild-channels-information-with-oauth2-guilds-scope

# 구현 화면

## 비로그인 상태 최초 접속

<img src="images/1.png"/>

## 로그인

<img src="images/2.png" />
디스코드에서 제공하는 OAuth2 로그인 화면

### 승인 후 인증 화면

<img src="images/3.png"/>
승인 후 인증 페이지에서 토큰 발급 처리 로직을 진행하는 동안의 화면

#### 인증 실패 시

<img src="images/4.png"/>
인증 실패시 출력되는 화면, 다시 로그인하기를 누르면 로그인 페이지로 이동됨

#### 인증 성공 시

<img src="images/5.png"/>
이 화면이 출력되고 잠히 수 메인 화면으로 이동됨

## 메인 화면

<img src="images/6.png"/>
현재 내가 관리중인 서버 리스트를 보여준다.(로그인한 디스코드 계정 기준)   
봇이 추가되어 있는지 여부를 보여주고, 추가되어 있으면 [관리] 버튼을, 추가되어 있지 않으면 [봇 추가] 버튼이 활성화 된다.   
봇 추가 버튼을 누르면 설치 페이지로 이동

### [봇 추가] 클릭 시

<img src="images/7.png"/>
서버에 봇을 추가할 수 있다.
