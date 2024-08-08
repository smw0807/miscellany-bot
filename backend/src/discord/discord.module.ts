import { forwardRef, Module } from '@nestjs/common';
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
import { PrismaModule } from 'src/prisma/prisma.module';
import { CachingManageModule } from 'src/caching/caching.module';

@Module({
  providers: [
    DiscordClientService,
    DiscordService,
    DiscordContextMenuService,
    DiscordMessageService,
    DiscordGuildsService,
    DiscordChannelService,
  ],
  imports: [
    GoogleTranslateModule,
    HttpModule,
    forwardRef(() => SupabaseModule),
    PrismaModule,
    CachingManageModule,
  ],
  exports: [DiscordMessageService],
  controllers: [DiscordController],
})
export class DiscordModule {}
