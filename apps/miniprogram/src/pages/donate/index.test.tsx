import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DonatePage } from "./index";

const navigateTo = vi.fn();
const createDonationCase = vi.fn().mockResolvedValue({ id: "case-1" });

vi.mock("../../services/donations", () => ({
  createDonationCase: (payload: unknown) => createDonationCase(payload)
}));

vi.mock("../../services/navigation", () => ({
  navigation: {
    navigateTo: (payload: unknown) => navigateTo(payload)
  }
}));

describe("DonatePage", () => {
  it("submits a donation case and redirects to success page", async () => {
    render(<DonatePage />);

    fireEvent.change(screen.getByLabelText("物品名称"), {
      target: { value: "儿童绘本" }
    });
    fireEvent.change(screen.getByLabelText("成色"), {
      target: { value: "九成新" }
    });
    fireEvent.change(screen.getByLabelText("补充说明"), {
      target: { value: "适合 6-8 岁" }
    });
    fireEvent.click(screen.getByText("提交捐赠"));

    await waitFor(() => {
      expect(createDonationCase).toHaveBeenCalledWith({
        title: "儿童绘本",
        conditionLabel: "九成新",
        description: "适合 6-8 岁"
      });
      expect(navigateTo).toHaveBeenCalledWith("/pages/donate-success/index");
    });
  });
});
