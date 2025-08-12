import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, LoginBodyType } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginBodyType) {
    return this.authService.login(loginBody);
  }
}
