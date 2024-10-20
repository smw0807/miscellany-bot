//https://stackoverflow.com/questions/75434573/redefine-fetch-in-nuxt3-with-global-onrequest-handler
import { ofetch } from 'ofetch';
import useDialog from '~/composables/useDialog';
import { ResultTypeEnum } from '~/types/enums';
export default defineNuxtPlugin((nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    onRequest({ _request, options }) {
      options.retry = 0;
      options.baseURL = nuxtApp.$config.public.apiUrl;
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    },
    onResponse({ response }) {
      // console.log('onResponse', response);
      const status = response.status;
      if (status === 500) {
        const { useAlert } = useDialog();
        useAlert({
          type: ResultTypeEnum.ERROR,
          title: '서버 에러',
          message:
            '서버 에러가 발생했습니다.<br/>잠시 후 다시 시도해주세요.<br/>문제가 지속될 경우 관리자에게 문의해주세요.',
        });
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
