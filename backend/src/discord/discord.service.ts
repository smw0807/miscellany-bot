import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { Client } from 'discord.js';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';
import { HttpService } from '@nestjs/axios';
import DiscordConfig from 'src/config/conf/discord.config';
import { ConfigType } from '@nestjs/config';
import { DISCORD_API_URL } from 'src/constants/discord-api-url';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly client: Client;
  constructor(
    private readonly clientService: DiscordClientService,
    private readonly contextMenuService: DiscordContextMenuService,
    private readonly messageService: DiscordMessageService,
    private readonly httpService: HttpService,
    @Inject(DiscordConfig.KEY)
    private readonly discordConfig: ConfigType<typeof DiscordConfig>,
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

  /**
   * 사용자 길드 목록 가져오기(디스코드 채널)
   * @param accessToken
   * @returns
   */
  async getUserGuilds(accessToken: string) {
    const response = await this.httpService.axiosRef.get(
      DISCORD_API_URL.GUILDS,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }
}
