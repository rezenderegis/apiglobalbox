import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.headers['x-api-key'];
    const validKey = this.config.get<string>('API_KEY');

    if (!apiKey || apiKey !== validKey) {
      throw new UnauthorizedException('API Key inválida ou ausente');
    }

    return true;
  }
}
