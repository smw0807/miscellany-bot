import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DiscordMessageService } from './messages/discord.message.service';
import { DiscordGuildsService } from './guilds/discord.guilds.service';
import { SendMessageType } from './types/messages';
import { DiscordChannelService } from './guilds/discord.channel.service';
import { SendMessagesHistoryService } from 'src/supabase/send-messages-history/msg.history.service';

@Controller('discord')
export class DiscordController {
  private readonly logger = new Logger(DiscordController.name);
  constructor(
    private readonly guildsService: DiscordGuildsService,
    private readonly messageService: DiscordMessageService,
    private readonly channelService: DiscordChannelService,
    private readonly massageHistoryService: SendMessagesHistoryService,
  ) {}

  // 디스코드 채널 리스트
  @Get('guilds')
  async getOwnerGuilds(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.headers.authorization;
      const guilds = await this.guildsService.getOwnerGuilds(accessToken);
      res.send(guilds);
    } catch (e) {
      res.status(e.response.status).send(e.response.error);
    }
  }

  @Get('channels')
  async getGuildChannels(@Req() req: Request, @Res() res: Response) {
    try {
      const { guildId } = req.query;
      const channels = this.channelService.getGuildChannels(guildId as string);
      res.send(channels);
    } catch (e) {
      if (e.response) {
        res.status(e.response.status).send(e.response.error);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
      }
    }
  }

  // 디스코드 채널로 메시지 보내기
  @Post('send-message')
  async sendMessage(@Body() body: any, @Res() res: Response) {
    try {
      // const accessToken = req.headers.authorization;
      const { guildId, channelId, message, isEveryone } = body;
      const data: SendMessageType = {
        guildId: guildId as string,
        channelId: channelId as string,
        message: message as string,
        isEveryone: Boolean(isEveryone),
      };
      const result = await this.messageService.sendMessage(data);
      if (result) {
        res.status(HttpStatus.CREATED).send('메시지를 성공적으로 보냈습니다.');
      }
    } catch (e) {
      res.status(e.getStatus()).send(e.message);
    }
  }

  // 채널에 메시지 전송 내역 조회
  @Get('send-message-history')
  async findSendMessageHistory(@Req() req: Request, @Res() res: Response) {
    try {
      const { guildId, pageSize, pageIndex } = req.query;
      const result = await this.massageHistoryService.findSendMessageHistory(
        guildId.toString(),
        Number(pageSize),
        Number(pageIndex),
      );
      res.send(result);
    } catch (e) {
      res.status(e.getStatus()).send(e.message);
    }
  }
}
