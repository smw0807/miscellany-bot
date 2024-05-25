//https://stackoverflow.com/questions/75434573/redefine-fetch-in-nuxt3-with-global-onrequest-handler
import { ofetch } from 'ofetch';
export default defineNuxtPlugin((nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    onRequest({ _request, options }) {
      options.retry = 0;
    },
    onResponse({ response }) {
      // console.log('onResponse', response);
      const status = response.status;
      if (status === 500) {
        alert('서버 접속이 원활하지 않습니다. 잠시 후 다시 시도해주세요.');
        nuxtApp.$router.push('/error/500');
      }
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
