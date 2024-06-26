export type TriggerMessageType = {
  guildId: string;
  message: string;
  isEveryone: boolean;
  triggerWord: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
