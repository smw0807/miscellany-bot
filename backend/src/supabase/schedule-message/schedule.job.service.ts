import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class ScheduleMessageJobService {
  private readonly logger = new Logger(ScheduleMessageJobService.name);
  constructor(private readonly prisma: PrismaService) {}

  // 크론잡 등록되어 있는지 확인
  async checkCronJob() {
    // 크론잡 등록되어 있는지 확인
  }

  // 등록되어 있는 크론잡 목록
  async listCronJobs() {
    // 등록되어 있는 크론잡 목록
  }

  // 크론잡 삭제
  async deleteCronJob() {
    // 크론잡 삭제
  }

  // 크론잡 등록
  async scheduleMessage(message: any) {
    // 크론잡 등록
  }

  // 데이터베이스에 있는 예약메시지 데이터 가져와서 스케줄 등록하기
  async scheduleMessages() {
    try {
      const scheduledMessages = await this.prisma.scheduledMessage.findMany({
        where: { isSend: false },
      });
      scheduledMessages.map((message) => {
        // 스케줄 등록
        // this.scheduleMessage(message);
      });
    } catch (e) {
      this.logger.error('예약 메시지 스케줄 등록에 실패했습니다.', e.message);
    }
  }
}
