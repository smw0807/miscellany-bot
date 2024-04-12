import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Request, Response } from 'express';

@Controller('discord')
export class DiscordController {
  private readonly logger = new Logger(DiscordController.name);
  constructor(private readonly discordService: DiscordService) {}

  // 디스코드 채널 리스트
  @Get('guilds')
  async getOwnerGuilds(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.headers.authorization;
      const guilds = await this.discordService.getOwnerGuilds(accessToken);
      res.send(guilds);
    } catch (e) {
      this.logger.error(e.message);
      res.status(400).send(e.message);
    }
  }
}
