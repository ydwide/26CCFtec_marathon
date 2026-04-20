import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("donations flow", () => {
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

  it("creates a donation case and advances it to pending review after ai draft generation", async () => {
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "九成新",
      description: "适合 6-8 岁"
    });

    expect(created.status).toBe(201);
    expect(created.body.status).toBe("已提交");

    const drafted = await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    expect(drafted.status).toBe(201);
    expect(drafted.body.status).toBe("待审核");
    expect(drafted.body.aiSuggestedPrice).toBeGreaterThan(0);
  });
});
