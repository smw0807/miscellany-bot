import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduledMessage } from '@prisma/client';

@Injectable()
export class ScheduleMessageService {
  private readonly logger = new Logger(ScheduleMessageService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 예약 메시지 등록
  async addScheduleMessage(data: ScheduledMessage) {
    try {
      const result = await this.prisma.scheduledMessage.create({
        data,
      });
      this.logger.debug(result, '예약 메시지 등록 성공');
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('예약 메시지 등록 실패', e);
      throw new HttpException(
        '예약 메시지 등록에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
