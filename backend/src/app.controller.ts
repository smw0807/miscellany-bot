import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('log-test')
  getLogTest(): string {
    this.logger.log('This is a test log');
    this.logger.debug('This is a test debug');
    this.logger.error('This is a test error');
    this.logger.verbose('This is a test verbose');
    this.logger.warn('This is a test warn');
    return 'Log test';
  }
}
