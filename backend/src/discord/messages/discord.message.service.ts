// 디스코드 메시지 서비스
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Client, TextChannel } from 'discord.js';
import { DiscordClientService } from '../client/discord.client.service';
import discordConfig from 'src/config/conf/discord.config';
import { ConfigType } from '@nestjs/config';
import { SendMessagesHistoryType, SendMessageType } from '../types/messages';
import { SendMessagesHistoryService } from 'src/supabase/send-messages-history/msg.history.service';
import { TriggerMessagesService } from 'src/supabase/trigger-messages/trigger.messages.service';

@Injectable()
export class DiscordMessageService extends DiscordClientService {
  private readonly logger = new Logger(DiscordMessageService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
    private readonly supabase: SendMessagesHistoryService,
    private readonly triggersService: TriggerMessagesService,
  ) {
    super(config);
  }

  // 메시지 이벤트 리스너
  onMessage(client: Client) {
    client.on('messageCreate', (message) => {
      let logMessage = `[ ${message.guild.name} ]`;
      if (message.author.globalName) {
        logMessage += ` ${message.author.globalName}(${message.member.nickname}): ${message.content}`;
      } else {
        logMessage += ` ${message.author.username} : ${message.content}`;
      }
      const trigger = this.triggersService.checkingTrigger(
        message.guildId as string,
        message.content,
      );
      if (trigger) {
        this.sendMessage(
          {
            guildId: message.guildId,
            channelId: message.channelId,
            isEveryone: false,
            message: trigger,
          },
          false,
        );
      }
      this.logger.log(logMessage);
    });
  }

  // 메시지 보내기
  async sendMessage(data: SendMessageType, saveHistory: boolean = true) {
    try {
      const { guildId, channelId, isEveryone, message } = data;

      const channel = this.client.channels.cache.get(channelId);
      if (!channel) {
        return new HttpException(
          '채널을 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!(channel instanceof TextChannel)) {
        return new HttpException(
          '메시지를 보낼 수 있는 채널이 아닙니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      await channel.send(isEveryone ? `@everyone\n${message}` : message);

      const params: SendMessagesHistoryType = {
        guildId: guildId,
        guildName: channel.guild.name,
        channelId: channelId,
        channelName: channel.name,
        isEveryone: isEveryone,
        message: message,
      };
      if (saveHistory) {
        await this.supabase.saveSendMessageHistory(params);
      }
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('sendMessage', e);
      throw new HttpException(
        '메시지를 보내는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
