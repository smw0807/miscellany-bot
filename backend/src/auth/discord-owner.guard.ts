import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { DiscordGuildsService } from 'src/discord/guilds/discord.guilds.service';

@Injectable()
export class DiscordOwnerGuard implements CanActivate {
  constructor(private readonly guildsService: DiscordGuildsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers.authorization;
    if (!accessToken) {
      throw new HttpException('인증 토큰이 없습니다.', HttpStatus.UNAUTHORIZED);
    }

    const guildId = this.extractGuildId(request);
    if (!guildId) {
      throw new HttpException(
        'guildId가 누락되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isOwner = await this.guildsService.isOwnerGuild(accessToken, guildId);
    if (!isOwner) {
      throw new HttpException(
        '해당 서버에 대한 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  private extractGuildId(request: Request) {
    const body = request.body as Record<string, unknown> | undefined;
    const query = request.query as Record<string, unknown> | undefined;

    if (typeof body?.guildId === 'string') return body.guildId;
    if (typeof query?.guildId === 'string') return query.guildId;
    return undefined;
  }
}
