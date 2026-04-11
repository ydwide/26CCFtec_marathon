import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReviewPage } from "./index";

const approveDonationCase = vi.fn().mockResolvedValue({ id: "product-1" });

vi.mock("../../services/review", () => ({
  getReviewDraft: async () => ({
    donationId: "case-1",
    statusLabel: "状态：等待策展润色",
    rawItemName: "儿童绘本",
    rawDescription: "平台整理后的上架文案",
    suggestedTitle: "儿童绘本套装",
    suggestedDescription: "平台整理后的上架文案",
    suggestedCategory: "图书文具",
    suggestedPriceInCents: 2900,
    conditionLabel: "9成新",
    aiBrand: "爱心品牌",
    aiItemName: "儿童绘本套装",
    aiAttributes: {
      适龄: "6-8岁",
      册数: "8册"
    },
    sampleCount: 3,
    priceRange: {
      min: 2500,
      max: 3900
    },
    priceSamples: []
  }),
  approveDonationCase: (donationCaseId: string, payload: unknown) =>
    approveDonationCase(donationCaseId, payload)
}));

describe("ReviewPage", () => {
  it("loads the enriched ai draft data and submits a publish action", async () => {
    render(<ReviewPage donationCaseId="case-1" />);

    expect((await screen.findAllByDisplayValue("儿童绘本套装")).length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("爱心品牌")).toBeTruthy();
    fireEvent.click(screen.getByText("采纳建议并提交审核"));

    await waitFor(() => {
      expect(approveDonationCase).toHaveBeenCalled();
    });
  });
});
