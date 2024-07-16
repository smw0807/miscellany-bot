import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ScheduleMessageService } from './schedule.message.service';
import { DiscordDataListInput } from '../inputs/common.inputs';

@Controller('schedule')
export class ScheduleMessageController {
  private readonly logger = new Logger(ScheduleMessageController.name);
  constructor(private readonly scheduleService: ScheduleMessageService) {}

  // 예약 메시지 목록 조회
  @Get('messages')
  async getScheduleMessages(
    @Query() params: DiscordDataListInput,
    @Res() res: Response,
  ) {
    try {
      const { guildId, pageSize, pageIndex } = params;
      if (!guildId || !pageSize || !pageIndex) {
        throw new HttpException(
          '필수 파라미터가 누락되었습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.scheduleService.getScheduleMessages(params);
      res.send(result);
    } catch (e) {
      this.logger.error('예약 메시지 목록 조회에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 예약 메시지 등록
  @Post('message')
  async addScheduleMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const params = req.body;
      const result = await this.scheduleService.addScheduleMessage(params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('예약 메시지 등록 성공');
      }
    } catch (e) {
      this.logger.error('예약 메시지 등록에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 예약 메시지 수정
  @Patch('message/:id')
  async updateScheduleMessage(
    @Param('id') id: string,
    @Query('data') data: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.scheduleService.updateScheduleMessage(
        id,
        JSON.parse(data),
      );
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('예약 메시지 수정 성공');
      }
      res.status(HttpStatus.NOT_MODIFIED).send('예약 메시지 수정 실패');
    } catch (e) {
      this.logger.error('예약 메시지 수정에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }
}
