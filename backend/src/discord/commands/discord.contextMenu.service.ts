// 디스코드 컨텍스트메뉴 서비스

import { Injectable, Logger } from '@nestjs/common';
import { ApplicationCommandType, Client } from 'discord.js';
import { GoogleTranslateService } from 'src/google-translate/google.translate.service';
import { LanguageCode } from 'src/constants/language-codes';
import { LanguageCommand } from 'src/constants/language-commands';
import { languageCommandMap } from 'src/constants/code-mapping';

@Injectable()
export class DiscordContextMenuService {
  private readonly logger = new Logger(DiscordContextMenuService.name);
  constructor(private translateService: GoogleTranslateService) {}

  // 컨텍스트 메뉴 추가
  createContextMenu(client: Client) {
    this.logger.log('### [ Create Context Menu ] Start ###');
    client.guilds.cache.forEach(async (guild) => {
      this.logger.log(`Server Name : ${guild.name}`);
      try {
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
      } catch (e) {
        this.logger.error('Guild Command Error', e);
      }
    });
    // await guild.commands.set([
    //   {
    //     // 아랍어로 번역
    //     name: LanguageCommand.TranslageToArabic,
    //     type: ApplicationCommandType.Message,
    //   },
    //   {
    //     // 터키어로 번역
    //     name: LanguageCommand.TranslageToTurkish,
    //     type: ApplicationCommandType.Message,
    //   },
    //   {
    //     // 폴란드어로 번역
    //     name: LanguageCommand.TranslageToPolish,
    //     type: ApplicationCommandType.Message,
    //   },
    // ]);
    this.logger.log('### [ Create Context Menu ] End ###');
  }

  // 컨텍스트메뉴 이벤트 리스너
  onContextMenu(client: Client) {
    client.on('interactionCreate', async (interaction) => {
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
    return languageCommandMap[command] || LanguageCode.English;
  }
}
