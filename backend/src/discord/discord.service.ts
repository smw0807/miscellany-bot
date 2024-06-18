import { Inject, Injectable, Logger } from '@nestjs/common';
import { DiscordClientService } from './client/discord.client.service';
import { DiscordContextMenuService } from './commands/discord.contextMenu.service';
import { DiscordMessageService } from './messages/discord.message.service';
import { ConfigType } from '@nestjs/config';
import discordConfig from 'src/config/conf/discord.config';
import { TriggerMessagesService } from 'src/supabase/trigger-messages/trigger.messages.service';

@Injectable()
export class DiscordService extends DiscordClientService {
  private readonly logger = new Logger(DiscordService.name);
  constructor(
    @Inject(discordConfig.KEY) config: ConfigType<typeof discordConfig>,
    private readonly contextMenuService: DiscordContextMenuService,
    private readonly messageService: DiscordMessageService,
    private readonly triggerService: TriggerMessagesService,
  ) {
    super(config);
    this.onReady();
  }

  onReady() {
    // 디스코드 봇 준비 완료 이벤트
    this.client.on('ready', () => {
      this.logger.log(`### [ Logged in as ${this.client.user.tag}! ] ###`);
      // 디스코드 컨텍스트 메뉴 서비스 실행
      this.contextMenuService.createContextMenu(this.client);
      // 디스코드 컨테스트 메뉴 이벤트 리스너
      this.contextMenuService.onContextMenu(this.client);
      // 디스코드 메시지 이벤트 리스너
      this.messageService.onMessage(this.client);
      // 트리거 메시지 캐싱
      this.client.guilds.cache.forEach((v) => {
        this.triggerService.loadTriggers(v.id);
      });
    });
  }
}
