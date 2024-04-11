import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly discordAuthService: AuthService) {}

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
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const accessToken = await this.discordAuthService.requestToken(
        session,
        code,
        state,
      );
      res.send(accessToken);
    } catch (e) {
      res.status(403).send('Invalid state');
    }
  }

  @Post('discord/refresh-token')
  async refreshDiscordToken(
    @Res() res: Response,
    @Query('refresh_token') refreshToken: string,
  ) {
    try {
      const token = await this.discordAuthService.refreshToken(refreshToken);
      res.send(token);
    } catch (e) {
      res.status(403).send('Invalid refresh token');
    }
  }
}
