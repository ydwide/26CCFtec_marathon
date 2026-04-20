import { describe, expect, it, vi, beforeEach } from "vitest";
import { DonationStatus } from "@ccf/shared";
import { DonationsService } from "../src/modules/donations/donations.service";
import type { RuntimeStore } from "../src/runtime";

const loadDonationCase = vi.fn();
const persistDonationCase = vi.fn();
const persistAiDraft = vi.fn();

vi.mock("../src/persistence/prisma", () => ({
  loadDonationCase: (...args: unknown[]) => loadDonationCase(...args),
  persistDonationCase: (...args: unknown[]) => persistDonationCase(...args),
  persistAiDraft: (...args: unknown[]) => persistAiDraft(...args)
}));

describe("DonationsService fallback", () => {
  beforeEach(() => {
    loadDonationCase.mockReset();
    persistDonationCase.mockReset();
    persistAiDraft.mockReset();
  });

  it("restores a persisted donation case before generating an ai draft", async () => {
    const store: RuntimeStore = {
      donationCases: new Map(),
      aiDrafts: new Map(),
      products: new Map(),
      orders: new Map()
    };

    const generatedDraft = {
      id: "draft-case-1",
      donationCaseId: "case-1",
      suggestedCategory: "图书文具",
      suggestedTitle: "儿童绘本套装",
      suggestedDescription: "平台整理后的上架文案",
      suggestedTags: ["亲子"],
      suggestedPriceInCents: 2900,
      aiBrand: "爱心品牌",
      aiItemName: "儿童绘本套装",
      aiAttributes: { 适龄: "6-8岁" },
      sampleCount: 3,
      priceRange: { min: 2500, max: 3900 },
      priceSamples: [],
      provider: "mock-ai-pricing"
    };

    const aiDraftsService = {
      generate: vi.fn().mockReturnValue(generatedDraft)
    };

    loadDonationCase.mockResolvedValue({
      id: "case-1",
      title: "儿童绘本",
      rawItemName: "儿童绘本",
      rawDescription: "适合 6-8 岁",
      rawCondition: "9成新",
      rawImages: ["https://example.com/book.png"],
      conditionLabel: "9成新",
      description: "适合 6-8 岁",
      status: DonationStatus.Submitted
    });

    const service = new DonationsService(store, aiDraftsService as never);

    const result = await service.generateAiDraft("case-1");

    expect(aiDraftsService.generate).toHaveBeenCalledWith("case-1");
    expect(store.donationCases.get("case-1")?.title).toBe("儿童绘本");
    expect(result.status).toBe(DonationStatus.PendingReview);
    expect(persistAiDraft).toHaveBeenCalledWith(generatedDraft);
  });
});
