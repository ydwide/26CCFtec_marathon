import type { MarketPriceSample } from "./market-price-adapter";

function getConditionCoefficient(conditionLabel?: string) {
  if (!conditionLabel) {
    return 0.75;
  }

  if (conditionLabel.includes("全新")) {
    return 0.98;
  }

  if (conditionLabel.includes("9成")) {
    return 0.88;
  }

  if (conditionLabel.includes("8成")) {
    return 0.72;
  }

  if (conditionLabel.includes("7成")) {
    return 0.62;
  }

  if (conditionLabel.includes("6成")) {
    return 0.48;
  }

  return 0.75;
}

export function calculateSuggestedPricing(input: {
  samples: MarketPriceSample[];
  conditionLabel?: string;
}) {
  const samplePrices = input.samples.map((sample) => sample.samplePrice);
  if (samplePrices.length === 0) {
    return {
      averagePriceInCents: 0,
      conditionCoefficient: getConditionCoefficient(input.conditionLabel),
      suggestedPriceInCents: 0,
      priceRange: {
        min: 0,
        max: 0
      },
      pricingReason: "暂未取得第三方价格样本，建议人工复核后再定价。"
    };
  }

  const averagePriceInCents = Math.round(
    samplePrices.reduce((sum, price) => sum + price, 0) / samplePrices.length
  );
  const conditionCoefficient = getConditionCoefficient(input.conditionLabel);
  const charityCoefficient = 0.85;
  const suggestedPriceInCents = Math.round(
    averagePriceInCents * conditionCoefficient * charityCoefficient
  );

  return {
    averagePriceInCents,
    conditionCoefficient,
    suggestedPriceInCents,
    priceRange: {
      min: Math.min(...samplePrices),
      max: Math.max(...samplePrices)
    },
    pricingReason: `基于${input.samples.length}个第三方样本，均价约${averagePriceInCents}分，结合${input.conditionLabel ?? "默认成色"}按系数${conditionCoefficient}估算建议价。`
  };
}
