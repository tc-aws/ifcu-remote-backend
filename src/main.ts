import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReactAppModule } from './client.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3010);

  const app2 = await NestFactory.create(ReactAppModule);
  app2.enableCors();
  await app2.listen(3011);
}
bootstrap();
