import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TriggerMessageType } from '../types/triggerMessages';
import { CachingService } from 'src/caching/cacing.service';

@Injectable()
export class TriggerMessagesService {
  private readonly logger = new Logger(TriggerMessagesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cachingService: CachingService,
  ) {}

  // 트리거 메시지 애플리케이션 내부에 저장
  async loadTriggers(guildId: string) {
    try {
      const triggers = await this.prisma.triggerMessage.findMany({
        where: {
          guildId,
          isUse: true,
        },
      });
      if (triggers.length === 0) {
        await this.cachingService.del(guildId);
        return;
      }
      const triggerMap = new Map<string, TriggerMessageType>();
      triggers.forEach((v) => {
        triggerMap.set(v.triggerWord, v);
      });
      // 길드별 저장
      await this.cachingService.set(guildId, triggerMap);
      console.log('test : ', await this.cachingService.get(guildId));
    } catch (e) {
      this.logger.error('트리거 로드 실패');
    }
  }

  // 저장된 트리거에 있는지 확인 및 메시지 반환
  async checkingTrigger(guildId: string, triggerWord: string) {
    // if (!(await this.cachingService.has(guildId))) return null;
    console.log('guildId : ', guildId);
    const guildTrigger = await this.cachingService.get(guildId);
    console.log('guildTrigger : ', guildTrigger);
    if (!guildTrigger) return null;

    const trigger = guildTrigger.get(triggerWord);
    console.log('trigger : ', trigger);
    return {
      isEveryone: trigger.isEveryone,
      message: trigger.message,
    };
  }

  // 트리거 캐싱 리프레쉬
  async refreshTriggers(guildId: string) {
    await this.loadTriggers(guildId);
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
      this.logger.error('getTriggerMessages', e);
      throw new HttpException(
        '트리거 메시지 목록 조회에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 등록
  async addTriggerMessage(data: TriggerMessageType) {
    try {
      const isDuplicate = await this.checkDuplicateTriggerWord(
        data.guildId,
        data.triggerWord,
      );
      if (isDuplicate) {
        return new HttpException(
          '이미 등록된 트리거 단어입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data.message.length === 0) {
        return new HttpException(
          '메시지를 입력해주세요.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data.triggerWord.length === 0) {
        return new HttpException(
          '트리거 단어를 입력해주세요.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.prisma.triggerMessage.create({ data });
      this.logger.debug(result, '트리거 메시지 등록 성공');
      await this.refreshTriggers(data.guildId);
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('addTriggerMessage', e);
      throw new HttpException(
        '트리거 메시지 등록에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 수정
  async updateTriggerMessage(id: string, data: TriggerMessageType) {
    try {
      const result = await this.prisma.triggerMessage.update({
        where: { id },
        data,
      });
      this.logger.debug(result, '트리거 메시지 수정 성공');
      await this.refreshTriggers(data.guildId);
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('updateTriggerMessage', e);
      throw new HttpException(
        '트리거 메시지 수정에 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 트리거 메시지 삭제
  async deleteTriggerMessage(data: { guildId: string; id: string[] }) {
    try {
      const { guildId, id } = data;
      if (id.length === 0) {
        return new HttpException(
          '선택된 트리거가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.prisma.triggerMessage.deleteMany({
        where: { id: { in: id } },
      });
      if (result.count === 0) {
        return new HttpException(
          '삭제할 트리거가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else if (result.count !== id.length) {
        return new HttpException(
          '몇몇 트리거 삭제에 실패했습니다.<br/>확인바랍니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.debug(result, '트리거 메시지 삭제 성공');
      await this.refreshTriggers(guildId);
      return HttpStatus.OK;
    } catch (e) {
      this.logger.error('deleteTriggerMessage', e);
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
