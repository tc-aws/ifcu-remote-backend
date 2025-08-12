import { Module } from '@nestjs/common';
import { UtilsModule } from 'src/utils/utils.module';
import { WarningSystemController } from './warning-system.controller';
import { WarningSystemService } from './warning-system.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherWarning } from 'src/database/database.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherWarning]), UtilsModule],
  controllers: [WarningSystemController],
  providers: [WarningSystemService],
  exports: [WarningSystemService],
})
export class WarningSystemModule {}
