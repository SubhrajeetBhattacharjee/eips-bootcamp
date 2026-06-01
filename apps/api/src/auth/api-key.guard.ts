import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const validApiKey = process.env.INTERNAL_API_KEY || 'dev-secret-key';

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
