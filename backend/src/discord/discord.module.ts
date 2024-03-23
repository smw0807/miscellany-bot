import { Module } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { DiscordMessageTriggerService } from './messages/discord.trigger.service';
import { DiscordReservationMessageService } from './messages/discord.reservation.service';
import { GoogleTranslateModule } from 'src/google-translate/google.translate.module';
import { DiscordService } from './discord.service';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';

@Module({
  providers: [
    DiscordClientService,
    DiscordContextMenuService,
    DiscordMessageService,
    DiscordMessageTriggerService,
    DiscordReservationMessageService,
    DiscordService,
  ],
  imports: [GoogleTranslateModule],
})
export class DiscordModule {}
