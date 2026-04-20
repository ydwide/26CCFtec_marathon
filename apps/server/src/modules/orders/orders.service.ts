import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, ProductStatus } from "@ccf/shared";
import { loadProduct, persistOrderLock } from "../../persistence/prisma";
import type { RuntimeStore } from "../../runtime";
import { createEntityId } from "../../utils/ids";

@Injectable()
export class OrdersService {
  constructor(@Inject("RUNTIME_STORE") private readonly store: RuntimeStore) {}

  async create(input: { productId: string; userId: string }) {
    let product = this.store.products.get(input.productId);

    if (!product) {
      const persistedProduct = await loadProduct(input.productId);

      if (persistedProduct) {
        product = {
          id: persistedProduct.id,
          donationCaseId: persistedProduct.donationCaseId,
          brand: persistedProduct.brand ?? undefined,
          itemName: persistedProduct.itemName ?? undefined,
          attributes:
            persistedProduct.attributes &&
            typeof persistedProduct.attributes === "object" &&
            !Array.isArray(persistedProduct.attributes)
              ? (persistedProduct.attributes as Record<string, string>)
              : undefined,
          title: persistedProduct.title,
          description: persistedProduct.description,
          category: persistedProduct.category,
          conditionLabel: persistedProduct.conditionLabel,
          priceInCents: persistedProduct.priceInCents,
          status: persistedProduct.status as ProductStatus
        };

        this.store.products.set(input.productId, product);
      }
    }

    if (!product) {
      throw new NotFoundException("商品不存在");
    }

    if (product.status !== ProductStatus.OnSale) {
      throw new ConflictException("商品当前不可购买");
    }

    product.status = ProductStatus.Locked;

    const order = {
      id: createEntityId("order"),
      userId: input.userId,
      productId: input.productId,
      amountInCents: product.priceInCents,
      status: OrderStatus.PendingPayment
    };

    this.store.orders.set(order.id, order);
    await persistOrderLock({
      orderId: order.id,
      userId: input.userId,
      productId: input.productId,
      amountInCents: order.amountInCents
    });

    return order;
  }
}
