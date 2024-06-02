export type TriggerMessageType = {
  guildId?: string;
  triggerWord: string;
  message: string;
  isEveryone: boolean;
};
export const useDiscordMessagesTriggerStore = defineStore(
  'discordMessagesTrigger',
  () => {
    // ============= State =============

    const state = {};

    // ============= Actions =============
    const actions = {};

    // ============= Return =============
    return {
      state,
      actions,
    };
  }
);
