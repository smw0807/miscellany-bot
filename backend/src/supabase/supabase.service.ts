import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  AuthInvalidCredentialsError,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import supabaseConfig from 'src/config/conf/supabase.config';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(
    @Inject(supabaseConfig.KEY)
    private readonly config: ConfigType<typeof supabaseConfig>,
  ) {
    // supabase 클라이언트 생성
    this.supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseKey,
    );
  }

  getClient() {
    return this.supabase;
  }

  // 디스코드 로그인
  async signInWithDiscord() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
    if (error) {
      this.logger.error('Failed to sign in with Discord', error);
      throw new AuthInvalidCredentialsError(error.message);
    }
    this.logger.log('Successfully signed in with Discord');
    this.logger.log(data);
    return data.url;
  }
}
