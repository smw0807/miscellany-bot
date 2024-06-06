import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TriggerMessagesService } from './trigger-messages/trigger.messages.service';
import { SupabaseController } from './supabase.controller';

@Module({
  controllers: [SupabaseController],
  providers: [
    SupabaseService,
    SendMessagesHistoryService,
    TriggerMessagesService,
  ],
  exports: [SendMessagesHistoryService],
  imports: [PrismaModule],
})
export class SupabaseModule {}
