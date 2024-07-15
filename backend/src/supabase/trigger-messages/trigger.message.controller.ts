import {
  Controller,
  Delete,
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
import { TriggerMessagesService } from './trigger.messages.service';
import { DiscordDataListInput } from '../inputs/common.inputs';
@Controller('trigger')
export class TriggerMessageController {
  private readonly logger = new Logger(TriggerMessageController.name);
  constructor(private readonly triggerService: TriggerMessagesService) {}

  // 트리거 메시지 목록 조회
  @Get('messages')
  async getTriggerMessages(
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
      const result = await this.triggerService.getTriggerMessages(
        guildId.toString(),
        Number(pageSize),
        Number(pageIndex),
      );
      res.send(result);
    } catch (e) {
      this.logger.error('트리거 메시지 목록 조회에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 트리거 메시지 등록
  @Post('message')
  async addTriggerMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const params = req.body;
      const result = await this.triggerService.addTriggerMessage(params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('트리거 메시지 등록 성공');
      }
      return res.status(result.getStatus()).send(result.getResponse());
    } catch (e) {
      this.logger.error('트리거 메시지 등록에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 트리거 메시지 수정
  @Patch('message/:id')
  async updateTriggerMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const id = req.params.id;
      const params = req.body;
      const result = await this.triggerService.updateTriggerMessage(id, params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('트리거 메시지 수정 성공');
      }
      res.status(HttpStatus.NOT_MODIFIED).send('트리거 메시지 수정 실패');
    } catch (e) {
      this.logger.error('트리거 메시지 수정에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }

  // 트리거 메시지 삭제
  @Delete('message')
  async deleteTriggerMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const params = req.body;
      const result = await this.triggerService.deleteTriggerMessage(params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('트리거 메시지 삭제 성공');
      }
      return res.status(result.getStatus()).send(result.getResponse());
    } catch (e) {
      this.logger.error('트리거 메시지 삭제에 실패했습니다.', e.message);
      res.status(e.getStatus()).send(e.getResponse());
    }
  }
}
