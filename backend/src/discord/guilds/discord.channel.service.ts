import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from '../client/discord.client.service';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { DISCORD_CHANNEL_TYPES } from 'src/constants/discord-api';

@Injectable()
export class DiscordChannelService extends DiscordClientService {
  private readonly logger = new Logger(DiscordChannelService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
  ) {
    super(config);
  }

  /**
   * 길드 채널 가져오기
   * @param guildId
   * @returns
   * https://stackoverflow.com/questions/69501363/discord-api-view-guild-channels-information-with-oauth2-guilds-scope
   * discord OAuth2를 통해 얻은 토큰으로는 서버의 채널 정보를 가져올 수 없다.
   * 그래서 discord.js 라이브러리를 사용하여 서버의 채널 정보를 가져온다.
   */
  getGuildChannels(guildId: string) {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) {
        throw new Error('서버 정보를 찾을 수 없습니다.');
      }
      const channels = guild.channels.cache.map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: DISCORD_CHANNEL_TYPES[channel.type],
      }));
      return channels;
    } catch (e) {
      const error = e.response.data;
      this.logger.error(error);
      throw new Error(e);
    }
  }
}
