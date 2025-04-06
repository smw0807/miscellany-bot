// 디스코드 메시지 서비스
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Client, Message, TextChannel } from 'discord.js';
import { DiscordClientService } from '../client/discord.client.service';
import discordConfig from 'src/config/conf/discord.config';
import { ConfigType } from '@nestjs/config';
import { SendMessagesHistoryType, SendMessageType } from '../types/messages';
import { SendMessagesHistoryService } from 'src/supabase/send-messages-history/msg.history.service';
import { TriggerMessagesService } from 'src/supabase/trigger-messages/trigger.messages.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { TriggerMessage } from '@prisma/client';
import { DiscordChannelService } from '../guilds/discord.channel.service';

@Injectable()
export class DiscordMessageService extends DiscordClientService {
  private readonly logger = new Logger(DiscordMessageService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
    private readonly supabase: SendMessagesHistoryService,
    private readonly triggersService: TriggerMessagesService,
    private readonly channelService: DiscordChannelService,
    private readonly prisma: PrismaService,
  ) {
    super(config);
  }

  // 메시지 이벤트 리스너
  onMessage(client: Client) {
    client.on('messageCreate', async (message) => {
      let logMessage = `[ ${message.guild.name} ]`;
      if (message.author.globalName) {
        logMessage += ` ${message.author.globalName}(${message.member.nickname}): ${message.content}`;
      } else {
        logMessage += ` ${message.author.username} : ${message.content}`;
      }

      // 봇 메시지가 아니고, 첫 단어가 !로 시작할 경우 트리거 체크 진행 (무한루프 방지)
      if (!message.author.bot && message.content.startsWith('!')) {
        try {
          const trigger = await this.triggersService.findTrigger(
            message.guildId,
            message.content,
          );
          this.sendTriggerMessage(message, trigger);
        } catch (e) {
          this.logger.error('onMessage', e.message);
        }
      }
      this.logger.log(logMessage);
    });
  }

  // 메시지 보내기
  async sendMessage(data: SendMessageType, saveHistory: boolean = true) {
    try {
      const { guildId, channelId, isEveryone, message } = data;
      const isEveryoneTransform =
        typeof isEveryone === 'string' ? isEveryone === 'true' : isEveryone;
      const channel = this.client.channels.cache.get(channelId);
      await this.channelService.sendChannelMessage(
        channelId,
        isEveryoneTransform ? `@everyone\n${message}` : message,
      );
      if (channel instanceof TextChannel) {
        const params: SendMessagesHistoryType = {
          guildId: guildId,
          guildName: channel.guild.name,
          channelId: channelId,
          channelName: channel.name,
          isEveryone: isEveryoneTransform,
          message: message,
        };
        if (saveHistory) {
          await this.supabase.saveSendMessageHistory(params);
        }
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

  // 트리거 메시지 보내기
  async sendTriggerMessage(message: Message, trigger: Partial<TriggerMessage>) {
    try {
      if (!trigger) {
        return;
      }
      const channelId = message.channelId;
      const content = trigger.isEveryone
        ? `@everyone\n${trigger.message}`
        : trigger.message;

      await this.channelService.sendChannelMessage(channelId, content);
    } catch (e) {
      this.logger.error('sendTriggerMessage', e.message);
    }
  }
  // 예약 메시지 보내기
  async sendScheduleMessage(id: string, data: SendMessageType) {
    try {
      const { channelId, isEveryone, message } = data;
      await this.channelService.sendChannelMessage(
        channelId,
        isEveryone ? `@everyone\n${message}` : message,
      );
      // 반복 메시지일 경우엔 진행중 상태로 고정
      if (data.scheduleType === 'RECURRING') {
        await this.prisma.scheduledMessage.update({
          where: { id },
          data: { sendStatus: 'IN_PROGRESS', lastSentAt: dayjs().toDate() },
        });
      } else {
        await this.prisma.scheduledMessage.update({
          where: { id },
          data: { sendStatus: 'SUCCESS', lastSentAt: dayjs().toDate() },
        });
      }
    } catch (e) {
      await this.prisma.scheduledMessage.update({
        where: { id },
        data: { sendStatus: 'FAIL' },
      });
      this.logger.error('예약메시지를 보내는데 실패했습니다.', e.message);
    }
  }
}
