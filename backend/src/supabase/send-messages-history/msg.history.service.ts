import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SendMessagesHistoryType } from 'src/discord/types/messages';
import { PrismaService } from 'src/prisma/prisma.service';
/**
 * 채널 전송 메시지 내역 서비스
 */
@Injectable()
export class SendMessagesHistoryService {
  private readonly logger = new Logger(SendMessagesHistoryService.name);
  constructor(private readonly prisma: PrismaService) {}

  //메시지 전송 내역 저장
  async saveSendMessageHistory(data: SendMessagesHistoryType) {
    try {
      const result = await this.prisma.channelMessage.create({ data: data });
      this.logger.debug(result, '메시지 전송 내역 저장 성공');
    } catch (e) {
      console.error(e);
      this.logger.error('메시지 전송 내역 저장에 실패했습니다.', e);
    }
  }

  //메시지 전송 내역 조회
  async findSendMessageHistory(
    guildId: string,
    pageSize: number,
    pageIndex: number,
  ) {
    try {
      const total = await this.prisma.channelMessage.count({
        where: {
          guildId: guildId,
        },
      });
      if (total === 0) return { data: [], total: 0 };

      const result = await this.prisma.channelMessage.findMany({
        where: {
          guildId: guildId,
        },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        data: result,
        total: total,
      };
    } catch (e) {
      this.logger.error('메시지 전송 내역 조회에 실패했습니다.', e);
      if (e instanceof HttpException) {
        throw new HttpException(
          '메시지 전송 내역 조회에 실패했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw e;
      }
    }
  }
}
