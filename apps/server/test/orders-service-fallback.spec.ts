import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductStatus, OrderStatus } from "@ccf/shared";
import { OrdersService } from "../src/modules/orders/orders.service";
import type { RuntimeStore } from "../src/runtime";

const loadProduct = vi.fn();
const persistOrderLock = vi.fn();

vi.mock("../src/persistence/prisma", () => ({
  loadProduct: (...args: unknown[]) => loadProduct(...args),
  persistOrderLock: (...args: unknown[]) => persistOrderLock(...args)
}));

describe("OrdersService fallback", () => {
  beforeEach(() => {
    loadProduct.mockReset();
    persistOrderLock.mockReset();
  });

  it("restores a persisted product before creating a locked order", async () => {
    const store: RuntimeStore = {
      donationCases: new Map(),
      aiDrafts: new Map(),
      products: new Map(),
      orders: new Map()
    };

    loadProduct.mockResolvedValue({
      id: "product-1",
      donationCaseId: "case-1",
      brand: "爱心品牌",
      itemName: "儿童绘本套装",
      attributes: { 适龄: "6-8岁" },
      title: "儿童绘本套装",
      description: "平台整理后的上架文案",
      category: "图书文具",
      conditionLabel: "9成新",
      priceInCents: 2900,
      status: ProductStatus.OnSale
    });

    const service = new OrdersService(store);
    const result = await service.create({
      productId: "product-1",
      userId: "buyer-1"
    });

    expect(result.status).toBe(OrderStatus.PendingPayment);
    expect(store.products.get("product-1")?.status).toBe(ProductStatus.Locked);
    expect(persistOrderLock).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: "product-1",
        userId: "buyer-1",
        amountInCents: 2900
      })
    );
  });
});
