import { forwardRef, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TriggerMessagesService } from './trigger-messages/trigger.messages.service';
import { ScheduleMessageService } from './schedule-message/schedule.message.service';
import { TriggerMessageController } from './trigger-messages/trigger.message.controller';
import { ScheduleMessageController } from './schedule-message/schedule.message.controller';
import { ScheduleMessageJobService } from './schedule-message/schedule.job.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscordModule } from 'src/discord/discord.module';
import { CachingModule } from 'src/caching/caching.module';

@Module({
  controllers: [TriggerMessageController, ScheduleMessageController],
  providers: [
    SupabaseService,
    SendMessagesHistoryService,
    TriggerMessagesService,
    ScheduleMessageService,
    ScheduleMessageJobService,
  ],
  exports: [
    SendMessagesHistoryService,
    TriggerMessagesService,
    ScheduleMessageJobService,
  ],
  imports: [
    forwardRef(() => DiscordModule),
    PrismaModule,
    ScheduleModule.forRoot(),
    CachingModule,
  ],
})
export class SupabaseModule {}
