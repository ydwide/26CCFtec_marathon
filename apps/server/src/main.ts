// 本地开发启动入口，后续接数据库和更多模块时仍从这里启动 Nest 应用。
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

void bootstrap();
