import { Controller, Get, Inject, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigType } from '@nestjs/config';
import DiscordConfig from 'src/config/conf/discord.config';
import SupabaseConfig from 'src/config/conf/supabase.config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject(DiscordConfig.KEY)
    private readonly discordConfig: ConfigType<typeof DiscordConfig>,
    @Inject(SupabaseConfig.KEY)
    private readonly supabaseConfig: ConfigType<typeof SupabaseConfig>,
  ) {}

  @Get('discord-login')
  redirectToDiscord(@Res() res: Response) {
    this.logger.log('Redirecting to Discord login');
    const discordClientID = this.discordConfig.dicordClientID;
    const authLoginUrl = this.discordConfig.discordRedirectUrl;
    const discordLoginUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientID}&redirect_uri=${authLoginUrl}&response_type=code`;

    res.redirect(discordLoginUrl);
  }
}
