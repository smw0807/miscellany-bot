import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduledMessage, ScheduleType } from '@prisma/client';

@Injectable()
export class ScheduleMessageService {
  private readonly logger = new Logger(ScheduleMessageService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 예약 메시지 등록
  async addScheduleMessage(data: ScheduledMessage) {
    try {
      if (!ScheduleType[data.scheduleType as keyof typeof ScheduleType]) {
        throw new HttpException(
          '예약 타입이 잘못되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.prisma.scheduledMessage.create({
        data: {
          ...data,
          scheduledAt: new Date(data.scheduledAt),
        },
      });
      this.logger.debug(result, '예약 메시지 등록 성공');
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('예약 메시지 등록 실패', e.message);
      throw new HttpException(
        '예약 메시지 등록에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
