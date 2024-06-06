import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TriggerMessageType } from '../types/triggerMessages';

@Injectable()
export class TriggerMessagesService {
  private readonly logger = new Logger(TriggerMessagesService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 트리거 메시지 목록 조회
  async getTriggerMessages() {}

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
      return HttpStatus.OK;
    } catch (e) {
      console.error(e);
      this.logger.error('트리거 메시지 등록에 실패했습니다.', e);
      if (e instanceof HttpException) {
        throw new HttpException(
          '트리거 메시지 등록에 실패했습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw e;
      }
    }
  }

  // 트리거 메시지 수정 1098235615574769706
  async updateTriggerMessage() {}

  // 트리거 메시지 삭제
  async deleteTriggerMessage() {}

  // 트리거 단어 중복 체크
  async checkDuplicateTriggerWord(
    guildId: string,
    triggerWord: string,
  ): Promise<boolean> {
    const result = await this.prisma.triggerMessage.count({
      where: { guildId, triggerWord },
    });
    return result !== 0;
  }
}
