import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  plugins: ['~/plugins/fetch-interceptor.ts'],
  modules: [
    (options: any, nuxt: any) => {
      nuxt.hooks.hook('vite:extendConfig', (config: any) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
    '@pinia/nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      projectName: import.meta.env.PROJECT_NAME,
      apiUrl: import.meta.env.API_URL,
      accessTokenName: import.meta.env.ACCESS_TOKEN_NAME,
      refreshTokenName: import.meta.env.REFRESH_TOKEN_NAME,
      accessTokenExpires: import.meta.env.ACCESS_TOKEN_EXPIRES,
      refreshTokenExpires: import.meta.env.REFRESH_TOKEN_EXPIRES,
      discordStorageName: import.meta.env.DISCORD_GUILD_STORAGE_NAME,
    },
  },
  devtools: {
    enabled: import.meta.env.NODE_ENV === 'development' ? true : false,
  },
});
