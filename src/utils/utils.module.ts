import { Module } from '@nestjs/common';
import { JwtSharedModule } from 'src/jwt-shared/jwt-shared.module';
import { ImageService, UtilsService } from './utils.service';

@Module({
  imports: [JwtSharedModule],
  providers: [UtilsService, ImageService],
  exports: [UtilsService, ImageService],
})
export class UtilsModule {}
