import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminToken = request.headers['admin_token'];

    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      throw new UnauthorizedException('Invalid or missing admin token');
    }

    return true;
  }
}
