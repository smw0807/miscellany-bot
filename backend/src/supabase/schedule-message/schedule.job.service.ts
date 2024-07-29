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
import { RepeatType, ScheduledMessage } from '@prisma/client';
import { DiscordMessageService } from 'src/discord/messages/discord.message.service';
import { SendMessageType } from 'src/discord/types/messages';
import * as dayjs from 'dayjs';

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
    // 처리할 예약 메시지들 처리 시작
    await this.makeScheduleMessages();
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
  async addCronJob(
    jobName: string,
    date: Date,
    data: Partial<ScheduledMessage>,
  ) {
    if (await this.checkCronJob(jobName)) {
      return;
    }
    this.logger.log(`예약 메시지 크론잡 등록: ${jobName}, ${date}, ${data}`);

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
      if (data.scheduleType === 'ONETIME') {
        // 전달 받은 시간에 디스코드 메시지 발 송 후 크론잡 삭제
        this.schedulerRegistry.deleteCronJob(jobName);
      }
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }
  // 반복 메시지 크론잡 인터벌 값 반환
  private makeCronTime(
    date: Date,
    repeatInterval: number,
    repeatType: RepeatType,
  ) {
    const d = dayjs(date);
    if (repeatType === 'DAY') {
      return `0 ${d.minute} ${d.hour} * * *`;
    } else if (repeatType === 'HOUR') {
      return `0 ${d.minute} * * * *`;
    } else if (repeatType === 'MINUTE') {
      // todo 분단위는 어떻게 해야할지 생각해봐야함....
      //${startMinute} ${startHour}-23/${Math.floor(intervalMinutes / 60)} * * *`;
      return `0 ${repeatInterval} * * * *`;
    }
  }

  // 크론잡 삭제
  private deleteCronJob(jobName: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.stop();
      this.schedulerRegistry.deleteCronJob(jobName);
      this.logger.log('크론잡 삭제 성공', jobName);
    } catch (e) {
      this.logger.error('크론잡 삭제 실패', e.message);
    }
  }
  //============ CronJob ============ E

  // 데이터베이스에 있는 예약메시지 데이터 가져와서 스케줄 등록하기
  private async makeScheduleMessages() {
    try {
      // 현재 시간보다 큰 1회성 예약 메시지 조회
      const oneTimeScheduleMessages =
        await this.prisma.scheduledMessage.findMany({
          where: {
            scheduledAt: { gte: new Date() },
            scheduleType: 'ONETIME',
            sendStatus: 'WAIT',
          },
        });
      // 전송 대기 또는 성공한 반복 예약 메시지 조회
      const recurringScheduleMessages =
        await this.prisma.scheduledMessage.findMany({
          where: {
            scheduleType: 'RECURRING',
            sendStatus: { in: ['WAIT', 'SUCCESS'] },
          },
        });
      const scheduleMessages = [
        ...oneTimeScheduleMessages,
        ...recurringScheduleMessages,
      ];

      for (const message of scheduleMessages) {
        const now = dayjs().locale('ko').format();
        const scheduledAt = dayjs(message.scheduledAt).locale('ko').format();
        console.log('now : ', now);
        console.log('scheduledAt : ', now);
        // 현재 시간보다 낮은 경우
        if (new Date(now) < new Date(scheduledAt)) {
          await this.addCronJob(
            `${message.id}@@${message.channelId}`,
            message.scheduledAt,
            message,
          );
        } else {
          const nextScheduledAt = await this.makeCronJobNextStartTime(
            new Date(now),
            new Date(scheduledAt),
            message.repeatInterval,
            message.repeatType,
          );
          console.log('check : ', nextScheduledAt);
          await this.addCronJob(
            `${message.id}@@${message.channelId}`,
            nextScheduledAt,
            message,
          );
        }
      }
    } catch (e) {
      this.logger.error('예약 메시지 스케줄 등록에 실패했습니다.', e.message);
    }
  }

  // 반복 메시지 시작 시간이 현재 시간보다 작을 경우 다음 시작 시간 계산
  private async makeCronJobNextStartTime(
    nowDate: Date,
    scheduledAt: Date,
    repeatInterval: number,
    repeatType: RepeatType,
  ) {
    if (nowDate < scheduledAt) {
      return scheduledAt;
    }
    const now = dayjs(nowDate);
    let nextScheduledAt = dayjs(scheduledAt);
    while (now > nextScheduledAt) {
      // 하루 이상 차이가 날 경우엔 날짜 차이만큼 추가해줌.
      const diff = now.diff(nextScheduledAt, 'day');
      if (diff > 0) {
        nextScheduledAt = nextScheduledAt
          .add(diff, 'day')
          .add(repeatInterval, repeatType as any);
      } else {
        nextScheduledAt = dayjs(nextScheduledAt).add(
          repeatInterval,
          repeatType as any,
        );
      }
    }
    return nextScheduledAt.locale('ko').toDate();
  }
}