import { describe, expect, it } from "vitest";
import { DonationStatus, OrderStatus, ProductStatus } from "./status";

describe("domain statuses", () => {
  it("keeps the donation workflow aligned with the spec", () => {
    expect(DonationStatus.Submitted).toBe("已提交");
    expect(DonationStatus.AiProcessing).toBe("AI整理中");
  });

  it("includes lock and sold states for products", () => {
    expect(ProductStatus.Locked).toBe("已锁定");
    expect(ProductStatus.Sold).toBe("已售出");
  });

  it("separates order lifecycle from payment lifecycle", () => {
    expect(OrderStatus.PendingPayment).toBe("待支付");
    expect(OrderStatus.Completed).toBe("已完成");
  });
});
