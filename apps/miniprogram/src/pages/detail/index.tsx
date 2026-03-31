import { payment } from "../../services/payment";
import { confirmPaid, createOrder } from "../../services/orders";

type ProductCard = {
  id: string;
  title: string;
  priceInCents: number;
  status: string;
};

// 商品详情页：承接“查看商品 -> 创建订单 -> 发起支付 -> 确认支付”这条购买主链。
export function ProductDetailPage({ product }: { product: ProductCard }) {
  async function handleBuy() {
    const order = await createOrder({ productId: product.id });
    await payment.request(order.paymentPayload);
    await confirmPaid(order.id);
  }

  return (
    <section>
      <h1>{product.title}</h1>
      <p>价格：{product.priceInCents / 100} 元</p>
      <p>状态：{product.status}</p>
      <button type="button" onClick={handleBuy} disabled={product.status !== "销售中"}>
        立即购买
      </button>
    </section>
  );
}
