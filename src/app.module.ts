import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './guards/guards.module';
import { ProjectModule } from './project/project.module';
import { ScheduledTasksService } from './scheduled-tasks/scheduled-tasks.service';
import { UtilsModule } from './utils/utils.module';
import { WarningSystemModule } from './warning-system/warning-system.module';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/database.sqlite',
      autoLoadEntities: true,
    }),
    WarningSystemModule,
    AuthModule,
    UtilsModule,
    GuardsModule,
    AdminModule,
    ProjectModule,
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduledTasksService],
})
export class AppModule {}
