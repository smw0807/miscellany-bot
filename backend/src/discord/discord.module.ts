import { Module } from '@nestjs/common';
import { DiscordClientService } from './discord.client.service';
import { DiscordMessageTriggerService } from './messages/discord.trigger.service';
import { DiscordReservationMessageService } from './messages/discord.reservation.service';

@Module({
  providers: [
    DiscordClientService,
    DiscordMessageTriggerService,
    DiscordReservationMessageService,
  ],
  imports: [],
})
export class DiscordModule {}
