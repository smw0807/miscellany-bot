import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import commonConfig from './conf/common.config';
import { validationSchema } from './validation.schema';
import discordConfig from './conf/discord.config';

const developmentEnv = '.env.development';
const productionEnv = '.env';
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? developmentEnv : productionEnv,
      load: [commonConfig, discordConfig],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
