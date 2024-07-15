import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduledMessage, ScheduleType } from '@prisma/client';
import { DiscordDataListInput } from '../inputs/common.inputs';
import { ScheduleMessageType } from '../types/scheduleMessage';

@Injectable()
export class ScheduleMessageService {
  private readonly logger = new Logger(ScheduleMessageService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 예약 메시지 목록 조회
  async getScheduleMessages(params: DiscordDataListInput) {
    try {
      const { guildId } = params;
      const pageSize = +params.pageSize;
      const pageIndex = +params.pageIndex;
      const result = {
        data: [],
        total: 0,
      };
      const total = await this.prisma.scheduledMessage.count({
        where: { guildId },
      });
      if (total === 0) result;
      result.total = total;
      result.data = await this.prisma.scheduledMessage.findMany({
        where: { guildId },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: 'desc' },
      });
      return result;
    } catch (e) {
      this.logger.error('예약 메시지 목록 조회 실패', e.message);
      throw new HttpException(
        '예약 메시지 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  // 예약 메시지 수정
  async updateScheduleMessage(id: string, data: ScheduleMessageType) {
    try {
      if (!id) {
        return new HttpException(
          'id가 누락되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const dataFormat = {
        ...data,
        scheduledAt: new Date(data.scheduledAt),
        repeatInterval: +data.repeatInterval || null,
        repeatType: data.repeatType || null,
        lastSentAt: data.lastSentAt ? new Date(data.lastSentAt) : null,
        updatedAt: new Date(),
      };

      const result = await this.prisma.scheduledMessage.update({
        where: { id },
        data: dataFormat,
      });
      this.logger.debug(result, '예약 메시지 수정 성공');
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('예약 메시지 수정 실패', e.message);
      throw new HttpException(
        '예약 메시지 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
