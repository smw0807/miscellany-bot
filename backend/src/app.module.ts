import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DiscordModule } from './discord/discord.module';
import { GoogleTranslateModule } from './google-translate/google.translate.module';

@Module({
  imports: [ConfigModule, DiscordModule, GoogleTranslateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
