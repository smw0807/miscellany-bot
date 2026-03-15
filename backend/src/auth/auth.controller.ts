import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import {
  DiscordRefreshTokenInput,
  DiscordTokenInput,
} from './dto/discord-token.input';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly discordAuthService: AuthService) {}

  // 디스코드 설치 URL 전달
  @Get('discord/install')
  async sendDiscordInstallUrl(@Res() res: Response) {
    try {
      const installUrl = this.discordAuthService.createInstallUrl();
      res.send(installUrl);
    } catch (e) {
      this.logger.error(e.message);
      res.status(400).send(e.message);
    }
  }

  // 디스코드 로그인 URL 생성
  @Get('discord/login')
  async createDiscordLoginUrl(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    try {
      const signinUrl = this.discordAuthService.createLoginUrl(session);
      res.send(signinUrl);
    } catch (e) {
      this.logger.error(e.message);
      res.status(400).send(e.message);
    }
  }

  // 디스코드 토큰 요청
  @Post('discord/token')
  async requestDisocorToken(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Body() body: DiscordTokenInput,
  ) {
    try {
      const accessToken = await this.discordAuthService.requestToken(
        session,
        body.code,
        body.state,
      );
      res.send(accessToken);
    } catch (e) {
      this.logger.error('requestDisocorToken Error', e.message);
      res.status(403).send('Invalid state');
    }
  }

  @Post('discord/refresh-token')
  async refreshDiscordToken(
    @Res() res: Response,
    @Body() body: DiscordRefreshTokenInput,
  ) {
    try {
      const token = await this.discordAuthService.refreshToken(
        body.refresh_token,
      );
      res.send(token);
    } catch (e) {
      this.logger.error('refreshDiscordToken Error', e.message);
      res.status(403).send('Invalid refresh token');
    }
  }
}
