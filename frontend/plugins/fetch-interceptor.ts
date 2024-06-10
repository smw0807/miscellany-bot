//https://stackoverflow.com/questions/75434573/redefine-fetch-in-nuxt3-with-global-onrequest-handler
import { ofetch } from 'ofetch';
export default defineNuxtPlugin((nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    onRequest({ _request, options }) {
      options.retry = 0;
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    },
    onResponse({ response }) {
      // console.log('onResponse', response);
      const status = response.status;
      if (status === 401) {
        const token = useAuth();
        token.clearToken();
        nuxtApp.$router.replace('/login');
      }
    },
    onRequestError({ error }) {
      console.error(error);
    },
  });
});
