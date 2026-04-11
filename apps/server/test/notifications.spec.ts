import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("notifications flow", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates a notification after review approval and marks it as read", async () => {
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "9成新",
      description: "适合 6-8 岁"
    });

    await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    await request(app.getHttpServer())
      .post(`/reviews/${created.body.id}/approve`)
      .send({
        title: "儿童绘本套装",
        description: "平台整理后的上架文案",
        category: "图书文具",
        conditionLabel: "9成新",
        priceInCents: 2900
      });

    const notifications = await request(app.getHttpServer()).get(
      "/notifications?userId=demo-user"
    );

    expect(notifications.status).toBe(200);
    expect(notifications.body).toHaveLength(1);
    expect(notifications.body[0].title).toBe("商品已上架");

    const marked = await request(app.getHttpServer()).post(
      `/notifications/${notifications.body[0].id}/read`
    );

    expect(marked.status).toBe(201);
    expect(marked.body.readAt).not.toBeNull();
  });
});
