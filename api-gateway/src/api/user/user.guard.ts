import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const accessToken: string =
      this.extractTokenFromHeader(request) ?? request.cookies?.accessToken;
    if (!accessToken) {
      throw new UnauthorizedException('You are not authorized.');
    }

    let userData;
    try {
      userData = await this.userService.validateAccessToken(accessToken);
    } catch {
      throw new UnauthorizedException('You are not authorized.');
    }

    if (!userData || !userData.role) {
      throw new UnauthorizedException('You are not authorized.');
    }

    request['user'] = {
      ...userData,
      accessToken,
    };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
