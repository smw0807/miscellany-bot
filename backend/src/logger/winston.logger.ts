import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(process.env.PROJECT_NAME),
      ),
    }),
    // 일반 로그 파일 설정 (날짜별 로테이션)
    new DailyRotateFile({
      filename: `logs/${process.env.PROJECT_NAME}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // 오류 로그 파일 설정 (날짜별 로테이션)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
