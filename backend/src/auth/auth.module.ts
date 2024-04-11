import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DiscordModule } from 'src/discord/discord.module';
import { AuthService } from './auth.service';

@Module({
  imports: [DiscordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
