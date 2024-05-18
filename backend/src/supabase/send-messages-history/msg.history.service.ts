import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';
/**
 * 채널 전송 메시지 내역 서비스
 */
@Injectable()
export class SendMessagesHistoryService {
  private readonly logger = new Logger(SendMessagesHistoryService.name);
  constructor(
    private readonly supabase: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  //todo 메시지 전송 내역 저장
  async saveSendMessageHistory(data) {
    console.log('saveSendMessageHistory : ', data);
    //todo
    const result = await this.prisma.channelMessage.create({ data: data });
    console.log('result : ', result);
  }
}
