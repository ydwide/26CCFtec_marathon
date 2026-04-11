import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("phase one acceptance flow", () => {
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

  it("covers donation submission, ai draft, review approval, notification, and order locking", async () => {
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "9成新",
      description: "适合 6-8 岁"
    });

    expect(created.status).toBe(201);

    const draft = await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    expect(draft.status).toBe(201);
    expect(draft.body.aiSuggestedPrice).toBeGreaterThan(0);

    const reviewDraft = await request(app.getHttpServer()).get(`/reviews/${created.body.id}`);

    expect(reviewDraft.status).toBe(200);
    expect(reviewDraft.body.aiBrand).toBeTruthy();

    const approved = await request(app.getHttpServer())
      .post(`/reviews/${created.body.id}/approve`)
      .send({
        finalBrand: reviewDraft.body.aiBrand,
        finalItemName: reviewDraft.body.aiItemName,
        finalAttributes: reviewDraft.body.aiAttributes,
        finalCategory: reviewDraft.body.suggestedCategory,
        finalConditionLabel: reviewDraft.body.conditionLabel,
        finalTitle: reviewDraft.body.suggestedTitle,
        finalDescription: reviewDraft.body.suggestedDescription,
        finalPriceInCents: reviewDraft.body.suggestedPriceInCents
      });

    expect(approved.status).toBe(201);

    const notifications = await request(app.getHttpServer()).get(
      "/notifications?userId=demo-user"
    );

    expect(notifications.status).toBe(200);
    expect(notifications.body.length).toBeGreaterThan(0);

    const order = await request(app.getHttpServer()).post("/orders").send({
      productId: approved.body.id,
      userId: "buyer-acceptance"
    });

    expect(order.status).toBe(201);
    expect(order.body.status).toBeTruthy();
  });
});
