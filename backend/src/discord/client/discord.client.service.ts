import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordClientService {
  // 봇 클라이언트
  private clientInstance: Client;
  constructor(
    @Inject(discordConfig.KEY) private config: ConfigType<typeof discordConfig>,
  ) {
    this.setupDiscordBot();
  }

  // 디스코드 봇 클라이언트 생성 및 로그인
  async setupDiscordBot() {
    // 봇 클라이언트 생성
    this.clientInstance = new Client({
      intents: [
        GatewayIntentBits.Guilds, // 서버 목록 조회
        GatewayIntentBits.GuildMessages, // 서버 메시지 조회
        GatewayIntentBits.MessageContent, // 메시지 내용 조회
      ],
    });
    // 봇 로그인
    await this.client.login(this.config.discordToken);
  }

  get client() {
    return this.clientInstance;
  }
}
