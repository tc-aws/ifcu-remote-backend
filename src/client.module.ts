import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ReactAppController } from './client.controller';
import { ReactAppService } from './client.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [ReactAppController],
  providers: [ReactAppService],
})
export class ReactAppModule {}
