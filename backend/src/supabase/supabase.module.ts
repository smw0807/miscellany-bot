import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';

@Module({
  providers: [SupabaseService, SendMessagesHistoryService],
  exports: [SendMessagesHistoryService],
})
export class SupabaseModule {}
