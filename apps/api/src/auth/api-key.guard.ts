/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Allow root health check endpoint
    if (request.url === '/' || request.path === '/') {
      return true;
    }

    const apiKey =
      request.headers['x-api-key'] ||
      request.query?.apiKey ||
      request.query?.['x-api-key'];

    const isProd = process.env.NODE_ENV === 'production';
    const validApiKey = process.env.INTERNAL_API_KEY;

    if (isProd && !validApiKey) {
      throw new UnauthorizedException(
        'Server configuration error: Internal API key not set',
      );
    }

    const expectedKey = validApiKey || 'dev-secret-key';

    if (!apiKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
