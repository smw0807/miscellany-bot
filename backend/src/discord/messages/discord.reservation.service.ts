import { Injectable, Logger } from '@nestjs/common';
// 디스코드 예약 메시지 서비스
@Injectable()
export class DiscordReservationMessageService {
  private readonly logger = new Logger(DiscordReservationMessageService.name);
}
