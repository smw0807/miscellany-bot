import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import winstonLogger from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(WinstonModule.createLogger(winstonLogger()));
  await app.listen(3000);
}
bootstrap();
