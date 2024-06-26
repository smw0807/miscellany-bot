import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DiscordClientService } from '../client/discord.client.service';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { ChannelType } from 'discord.js';

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
        return new HttpException(
          '서버 정보를 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      const channels = guild.channels.cache
        .filter((channel) => channel.type !== ChannelType.GuildCategory)
        .filter((channel) => channel.type === ChannelType.GuildText)
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
          type: ChannelType[channel.type],
        }));

      return channels;
    } catch (e) {
      this.logger.error('getGuildChannels', e);
      throw new HttpException(
        '서버 채널 정보를 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
