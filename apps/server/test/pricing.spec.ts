import { describe, expect, it } from "vitest";
import { calculateSuggestedPricing } from "../src/modules/ai-drafts/pricing";

describe("calculateSuggestedPricing", () => {
  it("calculates average price and adjusts suggestion by condition coefficient", () => {
    const result = calculateSuggestedPricing({
      samples: [
        { id: "1", sourcePlatform: "闲鱼", sampleTitle: "样本1", samplePrice: 2500 },
        { id: "2", sourcePlatform: "转转", sampleTitle: "样本2", samplePrice: 2900 },
        { id: "3", sourcePlatform: "淘宝二手", sampleTitle: "样本3", samplePrice: 3900 }
      ],
      conditionLabel: "9成新"
    });

    expect(result.averagePriceInCents).toBe(3100);
    expect(result.conditionCoefficient).toBe(0.88);
    expect(result.suggestedPriceInCents).toBe(2319);
    expect(result.priceRange).toEqual({
      min: 2500,
      max: 3900
    });
    expect(result.pricingReason).toContain("9成新");
  });

  it("returns a safe zero price when no market samples are available", () => {
    const result = calculateSuggestedPricing({
      samples: [],
      conditionLabel: "8成新"
    });

    expect(result.averagePriceInCents).toBe(0);
    expect(result.suggestedPriceInCents).toBe(0);
    expect(result.priceRange).toEqual({
      min: 0,
      max: 0
    });
  });
});
