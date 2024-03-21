import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import {
  ApplicationCommandType,
  Client,
  GatewayIntentBits,
  Guild,
} from 'discord.js';
import { GoogleTranslateService } from 'src/google-translate/google.translate.service';
import { LanguageCode } from 'src/constants/language-codes';
import { LanguageCommand } from 'src/constants/language-commands';

@Injectable()
export class DiscordClientService {
  private readonly logger = new Logger(DiscordClientService.name);
  // 봇 클라이언트
  private client: Client;
  // 봇 등록된 서버 목록
  private guildListMap = new Map<string, Guild>();
  // 봇 준비 완료 여부
  private isReady = false;

  constructor(
    @Inject(discordConfig.KEY) private config: ConfigType<typeof discordConfig>,
    private translateService: GoogleTranslateService,
  ) {
    this.setupDiscordBot();
  }

  /**
   * 디스코드 봇 클라이언트 설정
   */
  private setupDiscordBot() {
    // 봇 클라이언트 생성
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds, // 서버 목록 조회
        GatewayIntentBits.GuildMessages, // 서버 메시지 조회
        GatewayIntentBits.MessageContent, // 메시지 내용 조회
      ],
    });

    // 봇 준비 완료 이벤트
    this.client.on('ready', () => {
      this.logger.log(`### [ Logged in as ${this.client.user.tag}! ] ###`);
      this.isReady = true;
      this.getGuilds();
      // 메시지 이벤트 리스너 등록
      this.onMessage();
      // 컨텍스트 메뉴 추가
      this.createContextMenu();
      // 컨테스트 메뉴 이벤트 리스너 등록
      this.onContextMenu();
    });
    // 메시지 이벤트
    this.client.on('error', (error) => {
      this.logger.error('Discord Error', error);
    });

    // 봇 로그인
    this.client.login(this.config.DISCORD_TOKEN);
  }

  // 현재 봇이 추가된 서버 목록
  private getGuilds() {
    this.client.guilds.cache.forEach((guild: Guild) => {
      this.guildListMap.set(guild.id, guild);
    });
  }

  get clientInstance() {
    return this.client;
  }

  get ready() {
    return this.isReady;
  }

  getGuildInfo(guildId: string) {
    return this.guildListMap.get(guildId);
  }

  // 메시지 이벤트 리스너
  private onMessage() {
    this.client.on('messageCreate', (msg) => {
      this.logger.debug(
        `[ ${msg.author.globalName}(${msg.member.nickname}) ] : ${msg.content}`,
      );
    });
  }

  // 컨텍스트 메뉴 추가
  private async createContextMenu() {
    const guildId = '1098235615574769706';
    const guild = this.getGuildInfo(guildId);
    if (!guild) {
      this.logger.error('Guild not found');
      return;
    }
    await guild.commands.set([
      {
        // 독일어로 번역
        name: LanguageCommand.TranslageToGerman,
        type: ApplicationCommandType.Message,
      },
      {
        // 일본어로 번역
        name: LanguageCommand.TranslageToJapanese,
        type: ApplicationCommandType.Message,
      },
      {
        // 영어로 번역
        name: LanguageCommand.TranslageToEnglish,
        type: ApplicationCommandType.Message,
      },
      {
        // 한글로 번역
        name: LanguageCommand.TranslageToKorean,
        type: ApplicationCommandType.Message,
      },
    ]);
  }
  // 컨텍스트메뉴 이벤트 리스너
  onContextMenu() {
    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isMessageContextMenuCommand()) return;

      // 선택한 커맨드
      const targetLanguage = this.getTargetLanguage(interaction.commandName);

      // 선택한 메시지 정보
      const message = await interaction.channel.messages.fetch(
        interaction.targetId,
      );

      // 입력 메시지
      const content = message.content;
      // 텍스트 번역
      const translateText = await this.translateService.translateText(
        content,
        targetLanguage,
      );
      // 번역 결과 메시지 전송
      interaction.reply(translateText);
    });
  }

  // 선택한 번역 언어 코드
  private getTargetLanguage(command: string) {
    const commandName = Object.values(LanguageCommand).find(
      (v) => v === command,
    );
    if (!commandName) return LanguageCode.English;
    // 언어 코드 enum value 값 반환
    switch (commandName) {
      case LanguageCommand.TranslageToGerman:
        return LanguageCode.German;
      case LanguageCommand.TranslageToJapanese:
        return LanguageCode.Japanese;
      case LanguageCommand.TranslageToEnglish:
        return LanguageCode.English;
      case LanguageCommand.TranslageToKorean:
        return LanguageCode.Korean;
      default:
        return LanguageCode.English;
    }
  }
}
