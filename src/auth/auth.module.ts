import { Module } from '@nestjs/common';
import { JwtSharedModule } from 'src/jwt-shared/jwt-shared.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtSharedModule, UtilsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
