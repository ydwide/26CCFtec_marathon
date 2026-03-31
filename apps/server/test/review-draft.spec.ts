import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("review draft api", () => {
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

  it("returns the ai draft for a donation waiting for review", async () => {
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "九成新",
      description: "适合 6-8 岁"
    });

    await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    const draft = await request(app.getHttpServer()).get(`/reviews/${created.body.id}`);

    expect(draft.status).toBe(200);
    expect(draft.body.suggestedTitle).toBe("儿童绘本套装");
    expect(draft.body.suggestedCategory).toBe("图书文具");
  });
});
