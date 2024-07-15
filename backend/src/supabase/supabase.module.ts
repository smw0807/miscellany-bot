import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TriggerMessagesService } from './trigger-messages/trigger.messages.service';
import { SupabaseController } from './supabase.controller';
import { ScheduleMessageService } from './schedule-message/schedule.message.service';
import { TriggerMessageController } from './trigger-messages/trigger.message.controller';

@Module({
  controllers: [SupabaseController, TriggerMessageController],
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
