import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordModule } from 'src/discord/discord.module';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DiscordModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
