import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleType } from '@prisma/client';
import { DiscordDataListInput } from '../inputs/common.inputs';
import { ScheduleMessageInput } from '../inputs/schedule.inputs';
import { ScheduleMessageJobService } from './schedule.job.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ScheduleMessageService {
  private readonly logger = new Logger(ScheduleMessageService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobService: ScheduleMessageJobService,
  ) {}

  /** [예약메시지 목록 조회]
   * @param params
   * @returns
   */
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

  /** [예약메시지 등록]
   * @param data
   * @returns
   */
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
          isUse:
            typeof data.isUse === 'string' ? data.isUse === 'true' : data.isUse,
          repeatInterval: +data.repeatInterval || null,
          // scheduledAt: new Date(data.scheduledAt),
          scheduledAt: dayjs(data.scheduledAt).format(
            'YYYY-MM-DD HH:mm:00+09:00',
          ),
        },
      });

      if (result.isUse) {
        // 스케줄 등록
        this.jobService.addCronJob(
          `${result.id}@@${result.channelId}`,
          data.scheduledAt,
          result,
        );
      }

      this.logger.debug(result, '예약 메시지 등록 성공');
      return HttpStatus.OK;
    } catch (e) {
      console.error(e);
      this.logger.error('예약 메시지 등록 실패', e.message);
      throw new HttpException(
        '예약 메시지 등록에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** [예약메시지 수정]
   * @param id string : 예약 메시지 id
   * @param data
   * @returns
   */
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
        isUse:
          typeof data.isUse === 'string' ? data.isUse === 'true' : data.isUse,
        scheduledAt: dayjs(data.scheduledAt).format(
          'YYYY-MM-DD HH:mm:00+09:00',
        ),
        repeatInterval: +data.repeatInterval || null,
        repeatType: data.repeatType || null,
        lastSentAt: data.lastSentAt ? new Date(data.lastSentAt) : null,
        updatedAt: new Date(),
      };
      if (data.isUse) {
        dataFormat.lastSentAt = null;
        dataFormat.sendStatus = 'WAIT';
      }

      const result = await this.prisma.scheduledMessage.update({
        where: { id },
        data: dataFormat,
      });
      // 기존 스케줄 삭제
      await this.jobService.deleteCronJob(`${id}@@${result.channelId}`);
      if (result.isUse) {
        // 스케줄 등록
        this.jobService.addCronJob(
          `${result.id}@@${result.channelId}`,
          result.scheduledAt,
          result,
        );
      }

      this.logger.debug(result, '예약 메시지 수정 성공');
      return HttpStatus.OK;
    } catch (e) {
      console.error(e);
      this.logger.error('예약 메시지 수정 실패', e.message);
      throw new HttpException(
        '예약 메시지 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** [예약메시지 삭제]
   * @param id string | string[] : 예약 메시지 id
   * @returns
   */
  async deleteScheduleMessage(id: string | string[]) {
    try {
      if (!id) {
        return new HttpException(
          'id가 누락되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const where = typeof id === 'string' ? { id } : { id: { in: id } };
      const lists = await this.prisma.scheduledMessage.findMany({
        where,
      });
      const result = await this.prisma.scheduledMessage.deleteMany({
        where,
      });

      // 크론잡 삭제
      for (const list of lists) {
        await this.jobService.deleteCronJob(`${list.id}@@${list.channelId}`);
      }

      this.logger.debug(result, '예약 메시지 삭제 성공');
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('예약 메시지 삭제 실패', e.message);
      throw new HttpException(
        '예약 메시지 삭제에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
