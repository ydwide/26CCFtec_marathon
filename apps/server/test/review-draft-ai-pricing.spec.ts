import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("review draft ai pricing api", () => {
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

  it("returns enriched ai pricing fields for review drafts", async () => {
    const productImageUrl = "https://img.example.test/book-set.jpg";
    const created = await request(app.getHttpServer()).post("/donations").send({
      title: "儿童绘本",
      conditionLabel: "9成新",
      description: "适合 6-8 岁",
      imageUrls: [productImageUrl]
    });

    await request(app.getHttpServer())
      .post(`/donations/${created.body.id}/ai-draft`)
      .send();

    const draft = await request(app.getHttpServer()).get(`/reviews/${created.body.id}`);

    expect(draft.status).toBe(200);
    expect(draft.body.aiBrand).toBe("爱心品牌");
    expect(draft.body.aiItemName).toBe("儿童绘本套装");
    expect(draft.body.aiAttributes).toEqual({
      适龄: "6-8岁",
      册数: "8册",
      语言: "中文",
      识别来源: "产品图"
    });
    expect(draft.body.sampleCount).toBe(3);
    expect(draft.body.averagePriceInCents).toBe(3100);
    expect(draft.body.priceQuery).toContain("爱心品牌");
    expect(draft.body.priceQuery).toContain("产品图");
    expect(draft.body.pricingReason).toContain("第三方样本");
    expect(draft.body.provider).toBe("mock-vision-model+commerce-search-skill");
    expect(draft.body.intakeQrCode).toBe(`IN-${created.body.id}`);
    expect(draft.body.productBarcode).toMatch(/^HY-/);
    expect(draft.body.priceRange).toEqual({
      min: 2500,
      max: 3900
    });
    expect(draft.body.priceSamples).toHaveLength(3);
  });
});
