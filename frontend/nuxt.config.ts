import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
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
  devtools: { enabled: process.env.NODE_ENV === 'development' ? true : false },
  devServer: {
    port: 8080,
  },
});
