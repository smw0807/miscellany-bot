import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
}
