import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { DISCORD_API_URL } from 'src/constants/discord-api';
import { map } from 'rxjs';
import { DiscordClientService } from '../client/discord.client.service';
import { DiscordGuildsType } from '../types/guilds';

//guild관련 (서버) 서비스
@Injectable()
export class DiscordGuildsService extends DiscordClientService {
  private readonly logger = new Logger(DiscordGuildsService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
    private readonly httpService: HttpService,
  ) {
    super(config);
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
      const guilds: DiscordGuildsType[] = response
        .filter((guild) => guild.owner === true)
        .map((guild) => ({
          ...guild,
          icon: guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : null,
          hasBot: this.isBotAdded(guild.id),
        }));
      return guilds;
    } catch (e) {
      this.logger.error('getOwnerGuilds', e);
      const error = e.response.data;
      if (error.code === 0) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: '토큰 만료',
          },
          HttpStatus.UNAUTHORIZED,
          {
            cause: error,
          },
        );
      }
      throw new HttpException(
        '길드 목록을 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * 봇이 길드에 추가되었는지 확인
   * @param guildId 길드 아이디
   * @returns
   */
  isBotAdded(guildId: string): boolean {
    return this.client.guilds.cache.has(guildId);
  }
}
