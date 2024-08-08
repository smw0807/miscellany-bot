import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DiscordModule } from './discord/discord.module';
import { GoogleTranslateModule } from './google-translate/google.translate.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { CachingManageModule } from './caching/caching.module';

@Module({
  imports: [
    ConfigModule,
    DiscordModule,
    GoogleTranslateModule,
    PrismaModule,
    SupabaseModule,
    AuthModule,
    CachingManageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
