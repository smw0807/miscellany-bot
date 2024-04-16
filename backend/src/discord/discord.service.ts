import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { Client } from 'discord.js';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';
import { HttpService } from '@nestjs/axios';
import { DISCORD_API_URL } from 'src/constants/discord-api';
import { map } from 'rxjs';

type DiscordGuildType = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
  hasBot?: boolean;
};
@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly client: Client;
  constructor(
    private readonly clientService: DiscordClientService,
    private readonly contextMenuService: DiscordContextMenuService,
    private readonly messageService: DiscordMessageService,
    private readonly httpService: HttpService,
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
   * 봇이 길드에 추가되었는지 확인
   * @param guildId 길드 아이디
   * @returns
   */
  isBotAdded(guildId: string): boolean {
    return this.client.guilds.cache.has(guildId);
  }

  /**
   * 관리중인 길드 목록 가져오기(디스코드 채널)
   * @param accessToken
   * @returns
   */
  async getOwnerGuilds(accessToken: string) {
    try {
      const response = await this.httpService
        .get(DISCORD_API_URL.GUILDS, {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((response) => response.data))
        .toPromise();

      // 내가 관리중인 것만
      const guilds: DiscordGuildType[] = response
        .filter((guild) => guild.owner === true)
        .map((guild) => ({
          ...guild,
          icon: guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : null,
          hasBot: this.isBotAdded(guild.id),
        }));
      console.log(guilds);
      return guilds;
    } catch (e) {
      this.logger.error('getUserGuilds Error: ', e.message);
      throw new Error(e.message);
    }
  }
}
