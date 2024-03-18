import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import winstonLogger from './logger/winston.logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(WinstonModule.createLogger(winstonLogger()));

  const configService = app.get(ConfigService);
  const port = configService.get('common.appPort');
  await app.listen(port);
}
bootstrap();
