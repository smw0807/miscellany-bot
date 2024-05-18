import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SendMessagesHistoryService } from './send-messages-history/msg.history.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SupabaseService, SendMessagesHistoryService],
  exports: [SendMessagesHistoryService],
  imports: [PrismaModule],
})
export class SupabaseModule {}
