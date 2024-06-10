import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { TriggerMessagesService } from './trigger-messages/trigger.messages.service';
import { Request, Response } from 'express';

@Controller('supabase')
export class SupabaseController {
  private readonly logger = new Logger(SupabaseController.name);
  constructor(private readonly triggerService: TriggerMessagesService) {}

  // 트리거 메시지 목록 조회
  @Get('trigger-messages')
  async getTriggerMessages(@Req() req: Request, @Res() res: Response) {
    try {
      const { guildId, pageSize, pageIndex } = req.query;
      const result = await this.triggerService.getTriggerMessages(
        guildId.toString(),
        Number(pageSize),
        Number(pageIndex),
      );
      res.send(result);
    } catch (e) {
      this.logger.error('트리거 메시지 목록 조회에 실패했습니다.', e);
      if (e.response) {
        res.status(e.response.status).send(e.response.error);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
      }
    }
  }

  // 트리거 메시지 등록
  @Post('trigger-message')
  async addTriggerMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const params = req.body;
      const result = await this.triggerService.addTriggerMessage(params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('트리거 메시지 등록 성공');
      }
      return res.status(result.getStatus()).send(result.getResponse());
    } catch (e) {
      this.logger.error('트리거 메시지 등록에 실패했습니다.', e);
      if (e.response) {
        res.status(e.response.status).send(e.response.error);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
      }
    }
  }

  // 트리거 메시지 수정
  @Patch('trigger-message/:id')
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
      this.logger.error('트리거 메시지 수정에 실패했습니다.', e);
      if (e instanceof HttpException) {
        res.status(e.getStatus()).send(e.getResponse());
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
      }
    }
  }

  // 트리거 메시지 삭제
  @Delete('trigger-message')
  async deleteTriggerMessage(@Req() req: Request, @Res() res: Response) {
    try {
      const params = req.body;
      const result = await this.triggerService.deleteTriggerMessage(params);
      if (result === HttpStatus.OK) {
        return res.status(HttpStatus.OK).send('트리거 메시지 삭제 성공');
      }
      return res.status(result.getStatus()).send(result.getResponse());
    } catch (e) {
      this.logger.error('트리거 메시지 삭제에 실패했습니다.', e);
      if (e.response) {
        res.status(e.response.status).send(e.response.error);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e.message);
      }
    }
  }
}
