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
      console.log(data);
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

  // 트리거 메시지 수정
  async updateTriggerMessage() {}

  // 트리거 메시지 삭제
  async deleteTriggerMessage() {}
}
