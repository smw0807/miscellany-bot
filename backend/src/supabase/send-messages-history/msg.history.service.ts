import { Injectable, Logger } from '@nestjs/common';
import { SendMessagesHistoryType } from 'src/discord/types/messages';
import { PrismaService } from 'src/prisma/prisma.service';
/**
 * 채널 전송 메시지 내역 서비스
 */
@Injectable()
export class SendMessagesHistoryService {
  private readonly logger = new Logger(SendMessagesHistoryService.name);
  constructor(private readonly prisma: PrismaService) {}

  //todo 메시지 전송 내역 저장
  async saveSendMessageHistory(data: SendMessagesHistoryType) {
    try {
      console.log('saveSendMessageHistory : ', data);
      //todo
      const result = await this.prisma.channelMessage.create({ data: data });
      console.log('result : ', result);
    } catch (e) {
      console.error(e);
    }
  }
}
