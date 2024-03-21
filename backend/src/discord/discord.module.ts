import { Module } from '@nestjs/common';
import { DiscordClientService } from './discord.client.service';
import { DiscordMessageTriggerService } from './messages/discord.trigger.service';
import { DiscordReservationMessageService } from './messages/discord.reservation.service';
import { GoogleTranslateModule } from 'src/google-translate/google.translate.module';

@Module({
  providers: [
    DiscordClientService,
    DiscordMessageTriggerService,
    DiscordReservationMessageService,
  ],
  imports: [GoogleTranslateModule],
})
export class DiscordModule {}
