// 메시지 트리거 서비스

import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from '../discord.client.service';

@Injectable()
export class DiscordMessageTriggerService {
  private readonly logger = new Logger(DiscordMessageTriggerService.name);

  constructor(private readonly clinet: DiscordClientService) {
    this.pingPongTest();
  }

  /**
   * 테스트용 메시지 트리거
   * 디스코드 메시지가 'ping'일 경우 'pong'으로 응답
   */
  pingPongTest() {
    this.clinet.clientInstance.on('messageCreate', (msg) => {
      this.logger.debug('messageCreate', msg);
      if (msg.content === 'ping') {
        msg.reply('pong');
      }
    });
  }
}
