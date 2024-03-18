import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import common from './conf/common.config';
import { validationSchema } from './validation.schema';

const developmentEnv = '.env.development';
const productionEnv = '.env';
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? developmentEnv : productionEnv,
      load: [common],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
