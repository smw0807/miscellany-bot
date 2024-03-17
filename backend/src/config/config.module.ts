import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import common from './conf/common.config';
import { validationSchema } from './conf/validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
      load: [common],
      isGlobal: true,
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
