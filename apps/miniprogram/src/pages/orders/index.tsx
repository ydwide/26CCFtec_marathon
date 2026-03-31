import { useEffect, useState } from "react";
import { listOrders } from "../../services/orders";

type OrderItem = {
  id: string;
  title: string;
  amountInCents: number;
  status: string;
};

// 订单页：展示用户已创建订单及其支付/完成状态，承接购买后的结果查看。
export function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    void listOrders().then(setOrders);
  }, []);

  return (
    <section>
      <h1>我的订单</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.title} - {order.amountInCents / 100} 元 - {order.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
