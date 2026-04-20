import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("prisma schema", () => {
  it("defines the mvp core models", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");

    expect(schema).toContain("model User");
    expect(schema).toContain("model DonationCase");
    expect(schema).toContain("model Product");
    expect(schema).toContain("model Order");
    expect(schema).toContain("model NotificationRecord");
    expect(schema).toContain("model ImpactRecord");
  });

  it("includes ai pricing review persistence models and fields", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");

    expect(schema).toContain("rawItemName");
    expect(schema).toContain("rawDescription");
    expect(schema).toContain("rawCondition");
    expect(schema).toContain("rawImages");
    expect(schema).toContain("aiBrand");
    expect(schema).toContain("aiItemName");
    expect(schema).toContain("aiAttributes");
    expect(schema).toContain("priceQuery");
    expect(schema).toContain("sampleCount");
    expect(schema).toContain("suggestedMinPriceInCents");
    expect(schema).toContain("suggestedMaxPriceInCents");
    expect(schema).toContain("model AiPriceSample");
    expect(schema).toContain("model ReviewDecision");
    expect(schema).toContain("finalBrand");
    expect(schema).toContain("finalItemName");
    expect(schema).toContain("finalAttributes");
    expect(schema).toContain("finalPriceInCents");
  });
});
