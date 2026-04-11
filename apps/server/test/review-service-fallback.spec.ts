import { beforeEach, describe, expect, it, vi } from "vitest";
import { DonationStatus, ProductStatus } from "@ccf/shared";
import { ReviewService } from "../src/modules/review/review.service";
import type { RuntimeStore } from "../src/runtime";

const loadReviewDraft = vi.fn();
const persistApprovedReview = vi.fn();

vi.mock("../src/persistence/prisma", () => ({
  loadReviewDraft: (...args: unknown[]) => loadReviewDraft(...args),
  persistApprovedReview: (...args: unknown[]) => persistApprovedReview(...args)
}));

describe("ReviewService fallback", () => {
  beforeEach(() => {
    loadReviewDraft.mockReset();
    persistApprovedReview.mockReset();
  });

  it("approves from persisted review data when runtime cache is empty", async () => {
    const store: RuntimeStore = {
      donationCases: new Map(),
      aiDrafts: new Map(),
      products: new Map(),
      orders: new Map()
    };

    loadReviewDraft.mockResolvedValue({
      id: "case-1",
      title: "儿童绘本",
      rawItemName: "儿童绘本",
      rawDescription: "适合 6-8 岁",
      rawCondition: "9成新",
      rawImages: ["https://example.com/book.png"],
      conditionLabel: "9成新",
      description: "适合 6-8 岁",
      status: DonationStatus.PendingReview,
      aiDraft: {
        id: "draft-case-1",
        donationCaseId: "case-1",
        suggestedCategory: "图书文具",
        suggestedTitle: "儿童绘本套装",
        suggestedDescription: "平台整理后的上架文案",
        suggestedTags: ["亲子"],
        suggestedPriceInCents: 2900,
        suggestedMinPriceInCents: 2500,
        suggestedMaxPriceInCents: 3900,
        aiBrand: "爱心品牌",
        aiItemName: "儿童绘本套装",
        aiAttributes: { 适龄: "6-8岁" },
        sampleCount: 3,
        provider: "mock-ai-pricing",
        priceSamples: []
      }
    });

    const service = new ReviewService(store);

    const result = await service.approve("case-1", {
      finalBrand: "爱心品牌",
      finalItemName: "儿童绘本套装",
      finalAttributes: { 适龄: "6-8岁" },
      finalCategory: "图书文具",
      finalConditionLabel: "9成新",
      finalTitle: "儿童绘本套装",
      finalDescription: "平台整理后的上架文案",
      finalPriceInCents: 2900
    });

    expect(result.status).toBe(ProductStatus.OnSale);
    expect(store.donationCases.get("case-1")?.status).toBe(DonationStatus.Published);
    expect(store.aiDrafts.get("case-1")?.id).toBe("draft-case-1");
    expect(persistApprovedReview).toHaveBeenCalled();
  });
});
