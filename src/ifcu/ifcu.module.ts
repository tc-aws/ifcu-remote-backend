import { Module } from '@nestjs/common';
import { UtilsModule } from 'src/utils/utils.module';
import { IFCUController } from './ifcu.controller';
import { IFCUService } from './ifcu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherWarning } from 'src/database/database.entity';

@Module({
  imports: [UtilsModule],
  controllers: [IFCUController],
  providers: [IFCUService],
  exports: [IFCUService],
})
export class IFCUModule {}
