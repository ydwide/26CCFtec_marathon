import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReviewPage } from "./index";

const approveDonationCase = vi.fn().mockResolvedValue({ id: "product-1" });

vi.mock("../../services/review", () => ({
  getReviewDraft: async () => ({
    suggestedTitle: "儿童绘本套装",
    suggestedDescription: "平台整理后的上架文案",
    suggestedCategory: "图书文具",
    suggestedPriceInCents: 2900,
    conditionLabel: "九成新"
  }),
  approveDonationCase: (donationCaseId: string, payload: unknown) =>
    approveDonationCase(donationCaseId, payload)
}));

describe("ReviewPage", () => {
  it("loads ai draft data and submits a publish action", async () => {
    render(<ReviewPage donationCaseId="case-1" />);

    expect(await screen.findByDisplayValue("儿童绘本套装")).toBeTruthy();
    fireEvent.click(screen.getByText("确认上架"));

    await waitFor(() => {
      expect(approveDonationCase).toHaveBeenCalled();
    });
  });
});
