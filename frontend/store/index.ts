import { defineStore } from 'pinia';

export const useStore = defineStore('store', () => {
  const count = ref(90);
  const state = { count };

  const getters = {};

  const actions = {};

  return {
    ...state,
    ...getters,
    ...actions,
  };
});
