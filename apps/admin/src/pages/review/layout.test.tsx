import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReviewPage } from "./index";

const approveDonationCase = vi.fn().mockResolvedValue({ id: "product-1" });

vi.mock("../../services/review", () => ({
  getReviewDraft: async () => ({
    donationId: "case-1",
    statusLabel: "状态：等待策展润色",
    rawItemName: "复古相机",
    rawDescription: "希望给它找到一个能好好照顾它的人，让它继续发挥作用。",
    rawImageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    suggestedTitle: "时光掠影，1970s 复古胶片相机",
    suggestedDescription: "平台整理后的上架文案",
    suggestedCategory: "经典影像 / 胶片相机",
    suggestedPriceInCents: 85000,
    conditionLabel: "8成新",
    averagePriceInCents: 85000,
    priceQuery: "Canon 胶片相机 8成新",
    pricingReason: "市场均价 850 元，结合 8 成新与公益流通场景给出建议价。",
    aiBrand: "Canon",
    aiItemName: "胶片相机",
    aiAttributes: {
      年代: "1970s",
      成像方式: "胶片",
      颜色: "黑银"
    },
    sampleCount: 3,
    priceRange: {
      min: 78000,
      max: 92000
    },
    priceSamples: [
      { id: "sample-1", sourcePlatform: "闲鱼", sampleTitle: "Canon 胶片相机", samplePrice: 78000 },
      { id: "sample-2", sourcePlatform: "转转", sampleTitle: "复古胶片相机", samplePrice: 85000 },
      { id: "sample-3", sourcePlatform: "淘宝二手", sampleTitle: "老式胶片相机", samplePrice: 92000 }
    ]
  }),
  approveDonationCase: (donationCaseId: string, payload: unknown) =>
    approveDonationCase(donationCaseId, payload)
}));

describe("ReviewPage layout", () => {
  it("matches the curated ai workbench structure and submits enriched approval payload", async () => {
    render(<ReviewPage donationCaseId="case-1" />);

    expect(await screen.findByText("AI 智能整理台")).toBeTruthy();
    expect(screen.getByText("用户原始提交")).toBeTruthy();
    expect(screen.getByText("AI 智能策展建议")).toBeTruthy();
    expect(screen.getByDisplayValue("Canon")).toBeTruthy();
    expect(screen.getByDisplayValue("胶片相机")).toBeTruthy();
    expect(screen.getByDisplayValue("时光掠影，1970s 复古胶片相机")).toBeTruthy();
    expect(screen.getByText("重新生成")).toBeTruthy();
    expect(screen.getByText("手动微调")).toBeTruthy();
    expect(screen.getByText("市场均价")).toBeTruthy();
    expect(screen.getByText("查价关键词")).toBeTruthy();
    expect(screen.getByText("定价理由")).toBeTruthy();

    fireEvent.click(screen.getByText("采纳建议并提交审核"));

    await waitFor(() => {
      expect(approveDonationCase).toHaveBeenCalledWith(
        "case-1",
        expect.objectContaining({
          finalBrand: "Canon",
          finalItemName: "胶片相机",
          finalTitle: "时光掠影，1970s 复古胶片相机",
          finalPriceInCents: 85000
        })
      );
    });
  });
});
