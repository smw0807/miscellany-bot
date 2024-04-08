import {
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { DiscordAuthService } from 'src/discord/auth/discord.auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly discordAuthService: DiscordAuthService) {}

  // 디스코드 로그인 URL 생성
  @Get('discord/login')
  async redirectToDiscord(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    try {
      const signinUrl = this.discordAuthService.redirectToDiscord(session);
      res.send(signinUrl);
    } catch (e) {
      this.logger.error(e.message);
      res.status(400).send(e.message);
    }
  }

  // 디스코드 토큰 요청
  @Post('discord/token')
  async getDiscordAccessToken(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    try {
      const accessToken = await this.discordAuthService.requestDiscordToken(
        session,
        code,
        state,
      );
      res.send(accessToken);
    } catch (e) {
      res.status(403).send(new ForbiddenException('Invalid state'));
    }
  }
}
