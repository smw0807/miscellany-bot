// 메시지 트리거 서비스

import { Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from '../discord.client.service';

@Injectable()
export class DiscordMessageTriggerService {
  private readonly logger = new Logger(DiscordMessageTriggerService.name);

  constructor(private readonly clinet: DiscordClientService) {}
}
