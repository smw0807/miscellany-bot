import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TriggerInput } from '../inputs/trigger.inputs';
import { toBooleanValue } from 'src/utils/crypto-utils';

@Injectable()
export class TriggerMessagesService {
  private readonly logger = new Logger(TriggerMessagesService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 트리거 조회
  async findTrigger(guildId: string, triggerWord: string) {
    try {
      const result = await this.prisma.triggerMessage.findFirst({
        where: {
          guildId,
          triggerWord,
          isUse: true,
        },
        select: {
          isEveryone: true,
          message: true,
        },
      });
      if (!result) {
        this.logger.debug(
          `트리거 단어 ${triggerWord} 은/는 존재하지 않습니다.`,
        );
        return null;
      }
      return result;
    } catch (e) {
      this.logger.error('findTrigger', e.message);
      throw new HttpException(
        '트리거 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 목록 조회
  async getTriggerMessages(
    guildId: string,
    pageSize: number,
    pageIndex: number,
  ) {
    try {
      const total = await this.prisma.triggerMessage.count({
        where: { guildId },
      });
      if (total === 0) return { data: [], total: 0 };

      const result = await this.prisma.triggerMessage.findMany({
        where: { guildId },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: { createdAt: 'desc' },
      });
      return {
        data: result,
        total: total,
      };
    } catch (e) {
      this.logger.error('getTriggerMessages', e.message);
      throw new HttpException(
        '트리거 메시지 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 등록
  async addTriggerMessage(data: TriggerInput) {
    if (data.triggerWord.length === 0) {
      throw new HttpException(
        '트리거 단어를 입력해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.message.length === 0) {
      throw new HttpException('메시지를 입력해주세요.', HttpStatus.BAD_REQUEST);
    }
    try {
      const isDuplicate = await this.checkDuplicateTriggerWord(
        data.guildId,
        data.triggerWord,
      );
      if (isDuplicate) {
        throw new HttpException(
          '이미 등록된 트리거 단어입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.prisma.triggerMessage.create({
        data: {
          ...data,
          isEveryone: toBooleanValue(data.isEveryone),
          isUse: toBooleanValue(data.isUse),
        },
      });
      this.logger.debug(result, '트리거 메시지 등록 성공');
      return HttpStatus.OK;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error('addTriggerMessage', e.message);
      throw new HttpException(
        '트리거 메시지 등록에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 수정
  async updateTriggerMessage(id: string, data: TriggerInput) {
    try {
      const result = await this.prisma.triggerMessage.update({
        where: { id },
        data: {
          ...data,
          isEveryone: toBooleanValue(data.isEveryone),
          isUse: toBooleanValue(data.isUse),
        },
      });
      this.logger.debug(result, '트리거 메시지 수정 성공');
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('updateTriggerMessage', e.message);
      throw new HttpException(
        '트리거 메시지 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 삭제
  async deleteTriggerMessage(id: string | string[]) {
    if (!id) {
      throw new HttpException('id가 누락되었습니다.', HttpStatus.BAD_REQUEST);
    }
    try {
      const where = typeof id === 'string' ? { id } : { id: { in: id } };
      const result = await this.prisma.triggerMessage.deleteMany({
        where,
      });
      if (result.count === 0) {
        throw new HttpException(
          '삭제할 트리거가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const expectedCount = Array.isArray(id) ? id.length : 1;
      if (result.count !== expectedCount) {
        throw new HttpException(
          '몇몇 트리거 삭제에 실패했습니다.<br/>확인바랍니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.debug(result, '트리거 메시지 삭제 성공');
      return HttpStatus.OK;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error('deleteTriggerMessage', e.message);
      throw new HttpException(
        '트리거 메시지 삭제에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 단어 중복 체크
  private async checkDuplicateTriggerWord(
    guildId: string,
    triggerWord: string,
  ): Promise<boolean> {
    const result = await this.prisma.triggerMessage.count({
      where: { guildId, triggerWord },
    });
    return result !== 0;
  }
}
