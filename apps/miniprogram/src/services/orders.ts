// 订单服务：当前先用 mock 数据串通下单与支付确认流程，后续再接真实后端接口。
export async function createOrder(payload: { productId: string }) {
  return {
    id: "order-1",
    productId: payload.productId,
    status: "待支付",
    paymentPayload: { timeStamp: "1" }
  };
}

export async function confirmPaid(orderId: string) {
  return {
    id: orderId,
    status: "已支付"
  };
}

export async function listOrders() {
  return [
    {
      id: "order-1",
      title: "儿童绘本套装",
      amountInCents: 2900,
      status: "已支付"
    }
  ];
}
