// 디스코드 메시지 서비스
import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';

@Injectable()
export class DiscordMessageService {
  private readonly logger = new Logger(DiscordMessageService.name);
  constructor() {}

  // 메시지 이벤트 리스너
  onMessage(client: Client) {
    client.on('messageCreate', (message) => {
      let logMessage = `[ ${message.guild.name} ]`;
      if (message.author.globalName) {
        logMessage += ` ${message.author.globalName}(${message.member.nickname}): ${message.content}`;
      } else {
        logMessage += ` ${message.author.username} : ${message.content}`;
      }
      this.logger.log(logMessage);
    });
  }
}
