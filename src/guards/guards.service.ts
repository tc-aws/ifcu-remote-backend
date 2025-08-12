import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/jwt.config';
import { MESSAGE } from 'src/config/message.config';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class JwtUserAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly utilsService: UtilsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    //  check if token valid
    try {
      const token = await this.utilsService.extractTokenFromHeader(
        request.headers,
      );

      if (!token) {
        throw new UnauthorizedException(
          MESSAGE.ERRORS.AUTH.UNAUTHORIZED_ACCESS,
        );
      } else {
        await this.jwtService.verifyAsync(token, {
          secret: JWT_SECRET,
        });
      }
    } catch {
      throw new UnauthorizedException(MESSAGE.ERRORS.AUTH.UNAUTHORIZED_ACCESS);
    }

    //  check if user valid (e.g. not deleted)
    try {
      const username = await this.utilsService.getUsernameFromHeaders(
        request.headers,
      );
      const user = null;
      if (!user) {
        throw new UnauthorizedException(
          MESSAGE.ERRORS.AUTH.INVALID_USER_USER_DELETED,
        );
      } else {
        if (user.deleted) {
          throw new UnauthorizedException(
            MESSAGE.ERRORS.AUTH.INVALID_USER_USER_DELETED,
          );
        }
      }
    } catch {
      throw new UnauthorizedException(
        MESSAGE.ERRORS.AUTH.INVALID_USER_USER_DELETED,
      );
    }

    return true;
  }
}
