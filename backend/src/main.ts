import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './logger/winston.logger';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  const builder = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
