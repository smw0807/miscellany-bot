import { Module } from '@nestjs/common';
import { DiscordClientService } from './discord.client.service';

@Module({
  providers: [DiscordClientService],
  imports: [],
})
export class DiscordModule {}
