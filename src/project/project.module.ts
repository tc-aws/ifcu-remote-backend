import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';

@Module({
  imports: [],
  providers: [ProjectController],
})

export class ProjectModule {}
