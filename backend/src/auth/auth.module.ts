import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [DiscordModule],
  controllers: [AuthController],
})
export class AuthModule {}
