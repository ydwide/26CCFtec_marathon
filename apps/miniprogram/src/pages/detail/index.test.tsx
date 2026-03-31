import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ProductDetailPage } from "./index";

const createOrder = vi.fn().mockResolvedValue({
  id: "order-1",
  paymentPayload: { timeStamp: "1" }
});
const confirmPaid = vi.fn().mockResolvedValue({ status: "已支付" });
const requestPayment = vi.fn().mockResolvedValue(undefined);

vi.mock("../../services/orders", () => ({
  createOrder: (payload: unknown) => createOrder(payload),
  confirmPaid: (orderId: string) => confirmPaid(orderId)
}));

vi.mock("../../services/payment", () => ({
  payment: {
    request: (payload: unknown) => requestPayment(payload)
  }
}));

describe("ProductDetailPage", () => {
  it("creates an order and requests payment for an on-sale product", async () => {
    render(
      <ProductDetailPage
        product={{
          id: "product-1",
          title: "儿童绘本套装",
          priceInCents: 2900,
          status: "销售中"
        }}
      />
    );

    fireEvent.click(screen.getByText("立即购买"));

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledWith({ productId: "product-1" });
      expect(requestPayment).toHaveBeenCalledWith({ timeStamp: "1" });
      expect(confirmPaid).toHaveBeenCalledWith("order-1");
    });
  });
});
