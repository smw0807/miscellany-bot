import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
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
      this.logger.error('디스코드 채널 리스트 조회에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  @Get('channels')
  getGuildChannels(@Query('guildId') guildId: string, @Res() res: Response) {
    try {
      const channels = this.channelService.getGuildChannels(guildId);
      if (channels instanceof HttpException) {
        throw channels;
      }
      res.send(channels);
    } catch (e) {
      this.logger.error('디스코드 채널 리스트 조회에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 디스코드 채널로 메시지 보내기
  @Post('send-message')
  async sendMessage(@Query() params: SendMessageType, @Res() res: Response) {
    try {
      this.logger.log(params, 'sendMessage');
      await this.messageService.sendMessage(params);
      return res
        .status(HttpStatus.CREATED)
        .send('메시지를 성공적으로 보냈습니다.');
    } catch (e) {
      this.logger.error('메시지 전송에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 채널에 메시지 전송 내역 조회
  @Get('send-message-history')
  async findSendMessageHistory(
    @Query('guildId') guildId: string,
    @Query('pageSize') pageSize: number,
    @Query('pageIndex') pageIndex: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.massageHistoryService.findSendMessageHistory(
        guildId,
        +pageSize,
        +pageIndex,
      );
      res.send(result);
    } catch (e) {
      this.logger.error('메시지 전송 내역 조회에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }
}
