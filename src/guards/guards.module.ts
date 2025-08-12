import { Module } from '@nestjs/common';
import { JwtSharedModule } from 'src/jwt-shared/jwt-shared.module';
import { UtilsModule } from 'src/utils/utils.module';
import { JwtUserAuthGuard } from './guards.service';

@Module({
  imports: [JwtSharedModule, UtilsModule],
  providers: [JwtUserAuthGuard],
  exports: [JwtUserAuthGuard],
})
export class GuardsModule {}
