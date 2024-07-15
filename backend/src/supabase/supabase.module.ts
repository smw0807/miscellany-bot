import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TriggerMessagesService } from './trigger-messages/trigger.messages.service';
import { ScheduleMessageService } from './schedule-message/schedule.message.service';
import { TriggerMessageController } from './trigger-messages/trigger.message.controller';
import { ScheduleMessageController } from './schedule-message/schedule.message.controller';

@Module({
  controllers: [TriggerMessageController, ScheduleMessageController],
  providers: [
    SupabaseService,
    SendMessagesHistoryService,
    TriggerMessagesService,
    ScheduleMessageService,
  ],
  exports: [SendMessagesHistoryService, TriggerMessagesService],
  imports: [PrismaModule],
})
export class SupabaseModule {}
