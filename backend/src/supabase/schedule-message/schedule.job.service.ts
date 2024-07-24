import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ScheduleMessageService } from './schedule.message.service';
import { ScheduledMessage } from '@prisma/client';
import { DiscordMessageService } from 'src/discord/messages/discord.message.service';
import { SendMessageType } from 'src/discord/types/messages';

@Injectable()
export class ScheduleMessageJobService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleMessageJobService.name);
  constructor(
    private readonly prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ScheduleMessageService))
    private readonly scheduleService: ScheduleMessageService,
    private readonly discordMessageService: DiscordMessageService,
  ) {}
  async onModuleInit() {
    this.logger.warn('ScheduleMessageJobService has been initialized.');
    // 발송안된 1회성 예약 메시지 FAIL 처리 (매일 10분마다 실행)
    // this.addCronJob(
    //   'failOneTimeMessagesCronJob',
    //   CronExpression.EVERY_5_MINUTES,
    //   this.scheduleService.failOneTimeMessages,
    // );
    // 처리할 예약 메시지들 처리 시작
    await this.getScheduleMessages();

    // 등록된 크론잡 리스트
    this.listCronJobs();
  }
  onModuleDestroy() {
    this.logger.warn('ScheduleMessageJobService has been destroyed.');
  }

  //============= Check ============= S
  // 크론잡 등록되어 있는지 확인
  private async checkCronJob(jobName: string) {
    // 크론잡 등록되어 있는지 확인
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      this.logger.debug('### 크론잡이 등록되어 있습니다.', jobName);
      this.logger.debug(job);
      return true;
    } catch (e) {
      this.logger.debug('### 크론잡이 등록되어 있지 않습니다.', jobName);
      return false;
    }
  }
  //============= Check ============= E

  //============= List ============= S
  // 등록되어 있는 목록
  private listCronJobs() {
    // 등록되어 있는 크론잡 목록
    const jobs = this.schedulerRegistry.getCronJobs();
    this.logger.log('============ [ CronJob List ] ============');
    jobs.forEach((value, key) => {
      const nextDate = value.nextDates();
      this.logger.log(`CronJob: ${key} -> Next Date: ${nextDate}`);
    });
    this.logger.log('=========================================');
  }
  //============= List ============= E

  //============ CronJob ============ S
  // 크론잡 등록
  private addCronJob(jobName: string, time: string, func: Function) {
    const job = new CronJob(time, () => {
      func();
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  // 한 번만 실행하는 크론잡
  async addOneTimeCronJob(jobName: string, date: Date, func: Function) {
    const job = new CronJob(date, () => {
      func();
      this.schedulerRegistry.deleteCronJob(jobName);
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  // 1회성 메시지 크론잡 등록
  async addOneTimeCronJobForData(
    jobName: string,
    date: Date,
    data: Partial<ScheduledMessage>,
  ) {
    if (await this.checkCronJob(jobName)) {
      return;
    }
    this.logger.log('1회성 예약 메시지 크론잡 등록', jobName, date, data);
    // 전달 받은 시간에 디스코드 메시지 발 송 후 크론잡 삭제
    const job = new CronJob(date, async () => {
      // 디스코드 메시지 발송
      const sendMessage: SendMessageType = {
        guildId: data.guildId,
        channelId: data.channelId,
        isEveryone: data.isEveryone,
        message: data.messageContent,
      };

      await this.discordMessageService.snedScheduleMessage(
        data.id,
        sendMessage,
      );
      this.schedulerRegistry.deleteCronJob(jobName);
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  // 데이터베이스에 있는 예약메시지 데이터 가져와서 스케줄 등록하기
  private async getScheduleMessages() {
    try {
      // 현재 시간보다 큰 예약메시지 데이터 가져오기
      const scheduledMessages = await this.prisma.scheduledMessage.findMany({
        where: { scheduledAt: { gte: new Date() } },
      });

      for (const message of scheduledMessages) {
        if (message.scheduleType === 'ONETIME') {
          await this.addOneTimeCronJobForData(
            `${message.channelId}`,
            message.scheduledAt,
            message,
          );
        } else if (message.scheduleType === 'RECURRING') {
        } else {
          this.logger.error('예약 타입이 잘못된 데이터가 있습니다.', message);
        }
      }
    } catch (e) {
      this.logger.error('예약 메시지 스케줄 등록에 실패했습니다.', e.message);
    }
  }
}
