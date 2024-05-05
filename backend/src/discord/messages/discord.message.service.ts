// 디스코드 메시지 서비스
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { DiscordClientService } from '../client/discord.client.service';
import discordConfig from 'src/config/conf/discord.config';
import { ConfigType } from '@nestjs/config';
import { SendMessageType } from '../types/messages';

@Injectable()
export class DiscordMessageService extends DiscordClientService {
  private readonly logger = new Logger(DiscordMessageService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
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
      this.logger.log(logMessage);
    });
  }

  // 메시지 보내기
  async sendMessage(data: SendMessageType) {
    try {
      console.log('sendMessage : ', data);
      // const { guildId, channelId, message } = data;
      // const guild = this.client.guilds.cache.get(guildId);
      // console.log(guild);
      const channel = this.client.channels.cache.get('10982356155747697112');
      if (!channel) {
        throw new Error('채널을 찾을 수 없습니다.');
      }
      // todo send를 못찾는다고 떠서 해결 방법 찾아야함
      // await channel.send(message, {
      //   allowedMentions: { parse: ['users', 'roles', 'everyone'] },
      // });

      return false;
    } catch (e) {
      console.error(e);
    }
  }
}
// 1098235615574769711
