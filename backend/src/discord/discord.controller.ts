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
      if (e.response) {
        res.status(e.response.status).send(e.response.error);
      } else {
        res.status(500).send(e.message);
      }
    }
  }

  // 디스코드 채널로 메시지 보내기
  @Get('send-message')
  async sendMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.headers.authorization;
      const { channelId, message, isEveryone } = req.query;
      console.log(accessToken);
      console.log(channelId);
      console.log(message);
      console.log(isEveryone);
      res.send('test');
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
