import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class ScheduleMessageJobService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleMessageJobService.name);
  constructor(
    private readonly prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  onModuleInit() {
    this.logger.warn('ScheduleMessageJobService has been initialized.');
    // 발송안된 1회성 예약 메시지 FAIL 처리
    this.failOneTimeMessages();
    // 처리할 예약 메시지들 처리 시작
    this.getScheduleMessages();

    this.listCronJobs();
  }
  onModuleDestroy() {
    this.logger.warn('ScheduleMessageJobService has been destroyed.');
  }

  //============= Check ============= S
  // 크론잡 등록되어 있는지 확인
  async checkCronJob() {
    // 크론잡 등록되어 있는지 확인
  }
  // 스케줄러 등록되어 있는지 확인
  async checkScheduler() {
    // 스케줄러 등록되어 있는지 확인
  }
  //============= Check ============= E

  //============= List ============= S
  // 등록되어 있는 목록
  async listCronJobs() {
    // 등록되어 있는 크론잡 목록
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      const nextDate = value.nextDates();
      this.logger.log(`CronJob: ${key} -> Next Date: ${nextDate}`);
    });
  }
  //============= List ============= E

  //============= ETC ============== S
  // todo 크론잡에 등록하기
  // 아직 발송안된 1회성 메시지 FAIL 처리
  async failOneTimeMessages() {
    try {
      const oneTimeMessages = await this.prisma.scheduledMessage.findMany({
        where: { scheduleType: 'ONETIME', scheduledAt: { lt: new Date() } },
        select: { id: true },
      });
      const updated = await this.prisma.scheduledMessage.updateMany({
        where: {
          id: { in: oneTimeMessages.map((m) => m.id) },
          sendStatus: 'WAIT',
        },
        data: { sendStatus: 'FAIL' },
      });
      this.logger.log(
        `1회성 메시지 중에 아직 전송 안된 메시지 ${updated.count}개 FAIL 처리`,
      );
    } catch (e) {
      this.logger.error(
        '1회성 메시지 중에 아직 전송 안된 메시지 FAIL 처리에 실패했습니다.',
        e.message,
      );
    }
  }
  //============= ETC ============== E

  // 크론잡 삭제
  async deleteCronJob() {
    // 크론잡 삭제
  }

  // 크론잡 등록
  async addCronJob(message: any) {
    // 크론잡 등록
  }

  // 스케줄 등록
  async addScheduler() {
    // 데이터베이스에 있는 예약메시지 데이터 가져와서 스케줄 등록하기
  }

  // 데이터베이스에 있는 예약메시지 데이터 가져와서 스케줄 등록하기
  async getScheduleMessages() {
    try {
      // 현재 시간보다 큰 예약메시지 데이터 가져오기
      const scheduledMessages = await this.prisma.scheduledMessage.findMany({
        where: { scheduledAt: { gte: new Date() } },
      });

      for (const message of scheduledMessages) {
        if (message.scheduleType === 'ONETIME') {
          this.logger.log(message, 'ONETIME Message');
        } else if (message.scheduleType === 'RECURRING') {
          this.logger.log(message, 'RECURRING Message');
        } else {
          this.logger.error('예약 타입이 잘못된 데이터가 있습니다.', message);
        }
      }
    } catch (e) {
      this.logger.error('예약 메시지 스케줄 등록에 실패했습니다.', e.message);
    }
  }
}
