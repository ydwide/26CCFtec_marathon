import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("review publish and order locking", () => {
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

  it("publishes a reviewed product and prevents duplicate checkout while locked", async () => {
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "九成新",
      description: "适合 6-8 岁"
    });

    await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    const approved = await request(app.getHttpServer())
      .post(`/reviews/${created.body.id}/approve`)
      .send({
        title: "儿童绘本套装",
        description: "平台整理后的上架文案",
        category: "图书文具",
        conditionLabel: "九成新",
        priceInCents: 2900
      });

    expect(approved.status).toBe(201);
    expect(approved.body.status).toBe("销售中");

    const first = await request(app.getHttpServer()).post("/orders").send({
      productId: approved.body.id,
      userId: "buyer-1"
    });

    const second = await request(app.getHttpServer()).post("/orders").send({
      productId: approved.body.id,
      userId: "buyer-2"
    });

    expect(first.status).toBe(201);
    expect(first.body.status).toBe("待支付");
    expect(second.status).toBe(409);
  });
});
