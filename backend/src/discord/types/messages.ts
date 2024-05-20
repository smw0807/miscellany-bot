// 웹에서 보내는 메시지 타입
export type SendMessageType = {
  guildId: string;
  channelId: string;
  message: string;
  isEveryone: boolean;
};

// DB에 저장할 메시지 타입
export type SendMessagesHistoryType = {
  guildName: string;
  channelName: string;
} & SendMessageType;
