import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './guards/guards.module';
import { ProjectModule } from './project/project.module';
import { UtilsModule } from './utils/utils.module';
import { CrawlerModule } from './crawler/crawler.module';
import { IFCUModule } from './ifcu/ifcu.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/database.sqlite',
      autoLoadEntities: true,
    }),
    AuthModule,
    UtilsModule,
    GuardsModule,
    AdminModule,
    ProjectModule,
    CrawlerModule,
    IFCUModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
