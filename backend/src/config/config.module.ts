import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import commonConfig from './conf/common.config';
import { validationSchema } from './validation.schema';
import discordConfig from './conf/discord.config';
import googleTranslateConfig from './conf/google.translate.config';
import supabaseConfig from './conf/supabase.config';
import corsConfig from './conf/cors.config';

const developmentEnv = '.env.development';
const productionEnv = '.env';
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? developmentEnv : productionEnv,
      load: [
        commonConfig,
        discordConfig,
        googleTranslateConfig,
        supabaseConfig,
        corsConfig,
      ],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
