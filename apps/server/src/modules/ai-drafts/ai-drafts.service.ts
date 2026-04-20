import { Inject, Injectable } from "@nestjs/common";
import type { RuntimeStore } from "../../runtime";
import { createMarketPriceAdapter } from "./market-price-adapter";
import { calculateSuggestedPricing } from "./pricing";
import { createProductRecognitionAdapter } from "./product-recognition-adapter";

@Injectable()
export class AiDraftsService {
  constructor(@Inject("RUNTIME_STORE") private readonly store: RuntimeStore) {}

  async generate(donationCaseId: string) {
    const donationCase = this.store.donationCases.get(donationCaseId);
    const imageUrls = donationCase?.rawImageUrl ? [donationCase.rawImageUrl] : [];
    const productRecognitionAdapter = createProductRecognitionAdapter();
    const identified = await productRecognitionAdapter.recognize({
      imageUrls,
      fallbackTitle: donationCase?.title ?? "",
      description: donationCase?.description
    });

    const marketPriceAdapter = createMarketPriceAdapter();
    const marketResult = await marketPriceAdapter.lookup({
      brand: identified.aiBrand,
      itemName: identified.aiItemName,
      attributes: identified.aiAttributes,
      imageUrls,
      searchSkill: "commerce-market-search"
    });

    const pricing = calculateSuggestedPricing({
      samples: marketResult.samples,
      conditionLabel: donationCase?.conditionLabel
    });

    const draft = {
      id: `draft-${donationCaseId}`,
      donationCaseId,
      suggestedCategory: identified.suggestedCategory,
      suggestedTitle: identified.suggestedTitle,
      suggestedDescription: identified.suggestedDescription,
      suggestedTags: identified.suggestedTags,
      suggestedPriceInCents: pricing.suggestedPriceInCents,
      averagePriceInCents: pricing.averagePriceInCents,
      priceQuery: marketResult.query,
      pricingReason: pricing.pricingReason,
      conditionCoefficient: pricing.conditionCoefficient,
      aiBrand: identified.aiBrand,
      aiItemName: identified.aiItemName,
      aiAttributes: identified.aiAttributes,
      sampleCount: marketResult.samples.length,
      priceRange: pricing.priceRange,
      priceSamples: marketResult.samples,
      provider: `${identified.provider}+${
        process.env.MARKET_PRICE_API_URL ? "external-commerce-search-skill" : "commerce-search-skill"
      }`,
      intakeQrCode: `IN-${donationCaseId}`,
      productBarcode: `HY-${donationCaseId.slice(-8).toUpperCase()}`
    };

    this.store.aiDrafts.set(donationCaseId, draft);
    return draft;
  }
}
