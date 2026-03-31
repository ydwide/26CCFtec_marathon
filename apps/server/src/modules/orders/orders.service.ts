import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, ProductStatus } from "@ccf/shared";
import type { RuntimeStore } from "../../runtime";

@Injectable()
export class OrdersService {
  constructor(private readonly store: RuntimeStore) {}

  create(input: { productId: string; userId: string }) {
    const product = this.store.products.get(input.productId);

    if (!product) {
      throw new NotFoundException("商品不存在");
    }

    if (product.status !== ProductStatus.OnSale) {
      throw new ConflictException("商品当前不可购买");
    }

    product.status = ProductStatus.Locked;

    const order = {
      id: `order-${this.store.orders.size + 1}`,
      userId: input.userId,
      productId: input.productId,
      amountInCents: product.priceInCents,
      status: OrderStatus.PendingPayment
    };

    this.store.orders.set(order.id, order);
    return order;
  }
}
