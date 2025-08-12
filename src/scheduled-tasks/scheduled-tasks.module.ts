import { Module } from '@nestjs/common';
import { WarningSystemModule } from 'src/warning-system/warning-system.module';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { CrawlerModule } from 'src/crawler/crawler.module';

@Module({
  imports: [WarningSystemModule, CrawlerModule],
  providers: [ScheduledTasksService],
  exports: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
