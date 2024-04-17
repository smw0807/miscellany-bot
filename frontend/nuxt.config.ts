import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
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
      accessTokenName: import.meta.env.ACCESS_TOKEN_NAME,
      refreshTokenName: import.meta.env.REFRESH_TOKEN_NAME,
      accessTokenExpires: import.meta.env.ACCESS_TOKEN_EXPIRES,
      refreshTokenExpires: import.meta.env.REFRESH_TOKEN_EXPIRES,
      discordInstallUrl: import.meta.env.DISCORD_INSTALL_URL,
    },
  },
  devtools: {
    enabled: import.meta.env.NODE_ENV === 'development' ? true : false,
  },
});
