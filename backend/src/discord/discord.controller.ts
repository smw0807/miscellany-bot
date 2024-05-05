import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DiscordMessageService } from './messages/discord.message.service';
import { DiscordGuildsService } from './\bguilds/discord.guilds.service';
import { SendMessageType } from './types/messages';

@Controller('discord')
export class DiscordController {
  private readonly logger = new Logger(DiscordController.name);
  constructor(
    private readonly guildsService: DiscordGuildsService,
    private readonly messageService: DiscordMessageService,
  ) {}

  // 디스코드 채널 리스트
  @Get('guilds')
  async getOwnerGuilds(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.headers.authorization;
      const guilds = await this.guildsService.getOwnerGuilds(accessToken);
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
  // todo channel.send를 못찾는다고 떠서 해결 방법 찾아야함
  @Get('send-message')
  async sendMessage(@Req() req: Request, @Res() res: Response) {
    try {
      // const accessToken = req.headers.authorization;
      const { guildId, channelId, message, isEveryone } = req.query;
      const data: SendMessageType = {
        guildId: guildId as string,
        channelId: channelId as string,
        message: message as string,
        isEveryone: Boolean(isEveryone),
      };
      const result = await this.messageService.sendMessage(data);
      console.log('result :', result);
      res.send('test');
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
