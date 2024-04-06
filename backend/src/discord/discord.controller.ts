import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Request, Response } from 'express';

@Controller('discord')
export class DiscordController {
  private readonly logger = new Logger(DiscordController.name);
  constructor(private readonly discordService: DiscordService) {}

  // 디스코드 채널 리스트 //todo : 토큰 검증 가드 만들어서 적용하기
  @Get('guilds')
  async getUserGuilds(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.headers.authorization;
    const guilds = await this.discordService.getUserGuilds(accessToken);
    this.logger.log(`Discord Guilds: ${guilds}`);
    res.send(guilds);
  }
}
