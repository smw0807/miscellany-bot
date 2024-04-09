import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import DiscordConfig from 'src/config/conf/discord.config';
import { DISCORD_API_URL } from 'src/constants/discord-api-url';
import { map } from 'rxjs';
import { generateRandomString } from 'src/utils/crypto-utils';

@Injectable()
export class DiscordAuthService {
  private readonly logger = new Logger(DiscordAuthService.name);
  constructor(
    @Inject(DiscordConfig.KEY)
    private readonly discordConfig: ConfigType<typeof DiscordConfig>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * [디스코드 로그인 URL 생성]
   * @param session
   * @returns
   */
  createLoginUrl(session: Record<string, any>) {
    const { dicordClientID } = this.discordConfig;
    /**
     * 디스코드 API에 요청할 권한
     * https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
     */
    const scope = encodeURIComponent('email guilds');

    /**
     * CSRF 공격을 방지하기 위해 사용// 1회성 랜덤 문자열임
     * 공식문서에서 보안을 위해 사용하라고 권장
     * https://discord.com/developers/docs/topics/oauth2#state-and-security
     */
    const state = generateRandomString();
    session.state = state;

    // 정상적으로 로그인이 완료되면 리다이렉트 될 URL
    const redirectUrl = this.discordConfig.discordRedirectUrl;

    // 디스코드 로그인 URL 전달
    return `${DISCORD_API_URL.OAUTH2_AUTHORIZE}?client_id=${dicordClientID}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}`;
  }

  /**
   * [디스코드 토큰 요청]
   * @param session 세션정보
   * @param code 디스코드에서 받은 code
   * @param state 로그인 URL 생성할 때 만든 state 값
   * @returns
   */
  async requestToken(
    session: Record<string, any>,
    code: string,
    state: string,
  ) {
    const savedState = session.state;
    if (state !== savedState) {
      //세션에 저장된 state와 요청받은 state가 다르면 에러 발생
      this.logger.error('state is not equal!!!');
      throw new Error('Invalid state');
    }
    try {
      const params = {
        client_id: this.discordConfig.dicordClientID,
        client_secret: this.discordConfig.discordClientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.discordConfig.discordRedirectUrl,
      };

      const response = await this.httpService
        .post(
          DISCORD_API_URL.OAUTH2_TOKEN,
          new URLSearchParams(params).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(map((response) => response.data))
        .toPromise();
      return response;
    } catch (e) {
      this.logger.error(e.message);
      throw new Error('Failed to get token');
    }
  }
}
