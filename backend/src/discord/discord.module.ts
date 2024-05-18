import { Module } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { GoogleTranslateModule } from 'src/google-translate/google.translate.module';
import { DiscordService } from './discord.service';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordController } from './discord.controller';
import { DiscordGuildsService } from './guilds/discord.guilds.service';
import { DiscordChannelService } from './guilds/discord.channel.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { DiscordUsersService } from './users/discord.users.service';

@Module({
  providers: [
    DiscordClientService,
    DiscordService,
    DiscordContextMenuService,
    DiscordMessageService,
    DiscordGuildsService,
    DiscordChannelService,
    DiscordUsersService,
  ],
  imports: [GoogleTranslateModule, HttpModule, SupabaseModule],
  controllers: [DiscordController],
})
export class DiscordModule {}
