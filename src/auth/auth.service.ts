import { BadRequestException, Injectable } from '@nestjs/common';
import { MESSAGE } from 'src/config/message.config';
import { USER_ROLE } from 'src/enums/enums';
import { UtilsService } from 'src/utils/utils.service';

export type LoginBodyType = {
  username: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly utilsService: UtilsService) {}

  async login(loginBody: LoginBodyType) {
    const { username, password } = loginBody;

    const validate = (username: string, password: string) => {
      return username === 'admin' && password === 'RGT88admin';
    };

    if (!validate(username, password)) {
      throw new BadRequestException(MESSAGE.ERRORS.AUTH.CANNOT_VALIDATE_USER);
    }

    return {
      jwtToken: this.utilsService.generateToken({
        username,
        role: USER_ROLE.ADMIN,
      }),
    };
  }
}
