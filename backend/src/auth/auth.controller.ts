import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('discord-login')
  async redirectToDiscord(@Res() res: Response) {
    const signinUrl = await this.supabaseService.signInWithDiscord();
    res.send(signinUrl);
  }
}
