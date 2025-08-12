import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { CrawlerService } from 'src/crawler/crawler.service';
import { WarningSystemService } from 'src/warning-system/warning-system.service';
dayjs.extend(utc);

@Injectable()
export class ScheduledTasksService implements OnModuleInit {
  constructor(
    private readonly warningSystemService: WarningSystemService,
    private readonly crawlerService: CrawlerService,
  ) {}

  onModuleInit() {
    this.handleRegularFetch();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleRegularFetch() {
    const data = await this.crawlerService.fetchData();
    await this.warningSystemService.autoMode(data);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleRegularPublish() {
    this.warningSystemService.systemPublish();
  }
}
