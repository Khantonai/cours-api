import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard extends JwtGuard {
  constructor(reflector: Reflector, private authService: AuthService) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const userInfo = await this.authService.getUserInfoFromToken(token);

    if (userInfo && userInfo.isAdmin) {
      return true;
    } else {
      throw new UnauthorizedException('You do not have admin privileges');
    }
  }
}