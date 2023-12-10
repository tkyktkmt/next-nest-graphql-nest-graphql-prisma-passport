import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders:
      'access-control-allow-credentials,access-control-allow-origin,apollo-require-preflight,content-type',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
