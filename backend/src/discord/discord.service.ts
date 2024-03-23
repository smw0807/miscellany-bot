import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { Client } from 'discord.js';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly client: Client;
  constructor(
    private readonly clientService: DiscordClientService,
    private readonly contextMenuService: DiscordContextMenuService,
    private readonly messageService: DiscordMessageService,
  ) {
    // 디스코드 봇 클라이언트 서비스 실행
    this.clientService.setupDiscordBot();
    this.client = this.clientService.clientInstance;
    // 디스코드 봇 준비 완료 이벤트
    this.onReady();
  }

  onReady() {
    // 디스코드 봇 준비 완료 이벤트
    this.client.on('ready', () => {
      this.logger.log(`### [ Logged in as ${this.client.user.tag}! ] ###`);
      // 디스코드 컨텍스트 메뉴 서비스 실행
      this.contextMenuService.createContextMenu(this.client);
      // 디스코드 컨테스트 메뉴 이벤트 리스너
      this.contextMenuService.onContextMenu(this.client);
      // 디스코드 메시지 이벤트 리스너
      this.messageService.onMessage(this.client);
    });
  }
}
