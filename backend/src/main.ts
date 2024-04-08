import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './logger/winston.logger';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);

  // api prefix 적용
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  // cors 설정
  const corsConfig = configService.get('cors');
  app.enableCors({
    origin: corsConfig.origin,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
  });
  //sesstion 설정
  const commonConfig = configService.get('common');
  app.use(
    session({
      secret: commonConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  const port = configService.get('common.appPort');
  await app.listen(port);
}
bootstrap();
