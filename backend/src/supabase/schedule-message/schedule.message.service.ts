import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduledMessage, ScheduleType } from '@prisma/client';
import { DiscordDataListInput } from '../inputs/common.inputs';
import { ScheduleMessageInput } from '../inputs/schedule.inputs';
import { ScheduleMessageJobService } from './schedule.job.service';

@Injectable()
export class ScheduleMessageService {
  private readonly logger = new Logger(ScheduleMessageService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobService: ScheduleMessageJobService,
  ) {}

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
  async addScheduleMessage(data: ScheduleMessageInput) {
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
          isEveryone:
            typeof data.isEveryone === 'string'
              ? data.isEveryone === 'true'
              : data.isEveryone,
          repeatInterval: +data.repeatInterval || null,
          scheduledAt: new Date(data.scheduledAt),
        },
      });
      if (data.scheduleType === 'ONETIME') {
        this.jobService.addCronJob(
          `${result.id}@@${result.channelId}`,
          new Date(data.scheduledAt),
          result,
        );
      }
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
  async updateScheduleMessage(id: string, data: ScheduleMessageInput) {
    try {
      if (!id) {
        return new HttpException(
          'id가 누락되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!ScheduleType[data.scheduleType as keyof typeof ScheduleType]) {
        throw new HttpException(
          '예약 타입이 잘못되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const dataFormat = {
        ...data,
        isEveryone:
          typeof data.isEveryone === 'string'
            ? data.isEveryone === 'true'
            : data.isEveryone,
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

  // 아직 발송안된 1회성 메시지 FAIL 처리(스케줄러용)
  async failOneTimeMessages() {
    const logger = new Logger(ScheduleMessageService.name);
    try {
      const prisma = new PrismaService();
      await prisma.$connect();
      const oneTimeMessages = await prisma.scheduledMessage.findMany({
        where: { scheduleType: 'ONETIME', scheduledAt: { lt: new Date() } },
        select: { id: true },
      });
      const updated = await prisma.scheduledMessage.updateMany({
        where: {
          id: { in: oneTimeMessages.map((m) => m.id) },
          sendStatus: 'WAIT',
        },
        data: { sendStatus: 'FAIL' },
      });
      console.log(
        `1회성 메시지 중에 아직 전송 안된 메시지 ${updated.count}개 FAIL 처리`,
      );
      await prisma.$disconnect();
      logger.log(
        `1회성 메시지 중에 아직 전송 안된 메시지 ${updated.count}개 FAIL 처리`,
      );
    } catch (e) {
      console.error('아직 발송안된 1회성 메시지 FAIL 처리 실패', e.message);
      logger.error(
        '1회성 메시지 중에 아직 전송 안된 메시지 FAIL 처리에 실패했습니다.',
        e.message,
      );
    }
  }
}
