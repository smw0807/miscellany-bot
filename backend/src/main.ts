import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './logger/winston.logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(winstonLogger);

  // api prefix 적용
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('common.appPort');
  await app.listen(port);
}
bootstrap();
