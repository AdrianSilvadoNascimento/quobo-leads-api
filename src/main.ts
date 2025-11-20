import { NestApplication, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import job from "./cron/keep-alive";

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api/v1");

  job.start();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
