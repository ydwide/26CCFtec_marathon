import { Inject, Injectable } from "@nestjs/common";
import type { RuntimeStore } from "../../runtime";
import { createMarketPriceAdapter } from "./market-price-adapter";
import { calculateSuggestedPricing } from "./pricing";

@Injectable()
export class AiDraftsService {
  constructor(@Inject("RUNTIME_STORE") private readonly store: RuntimeStore) {}

  async generate(donationCaseId: string) {
    const donationCase = this.store.donationCases.get(donationCaseId);
    const rawTitle = donationCase?.title ?? "";
    const isBook = rawTitle.includes("绘本") || rawTitle.includes("图书");

    const identified = isBook
      ? {
          suggestedCategory: "图书文具",
          suggestedTitle: "儿童绘本套装",
          suggestedDescription: "平台已根据捐赠信息整理出适合上架的图书文案。",
          suggestedTags: ["亲子", "阅读", "公益流转"],
          aiBrand: "爱心品牌",
          aiItemName: "儿童绘本套装",
          aiAttributes: {
            适龄: "6-8岁",
            册数: "8册",
            语言: "中文"
          }
        }
      : {
          suggestedCategory: "经典影像 / 胶片相机",
          suggestedTitle: "时光掠影，1970s 复古胶片相机",
          suggestedDescription: "平台整理后的上架文案",
          suggestedTags: ["复古", "影像", "收藏"],
          aiBrand: "Canon",
          aiItemName: "胶片相机",
          aiAttributes: {
            年代: "1970s",
            成像方式: "胶片",
            颜色: "黑银"
          }
        };

    const marketPriceAdapter = createMarketPriceAdapter();
    const marketResult = await marketPriceAdapter.lookup({
      brand: identified.aiBrand,
      itemName: identified.aiItemName,
      attributes: identified.aiAttributes
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
      provider: process.env.MARKET_PRICE_API_URL ? "external-third-party-pricing" : "mock-third-party-pricing"
    };

    this.store.aiDrafts.set(donationCaseId, draft);
    return draft;
  }
}
