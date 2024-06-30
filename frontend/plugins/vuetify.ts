import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { VDateInput, VTimePicker } from 'vuetify/labs/components';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
    },
    components: {
      VDateInput,
      VTimePicker,
    },
  });
  app.vueApp.use(vuetify);
});
