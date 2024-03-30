import { Module } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { GoogleTranslateModule } from 'src/google-translate/google.translate.module';
import { DiscordService } from './discord.service';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';

@Module({
  providers: [
    DiscordClientService,
    DiscordContextMenuService,
    DiscordMessageService,
    DiscordService,
  ],
  imports: [GoogleTranslateModule],
})
export class DiscordModule {}
