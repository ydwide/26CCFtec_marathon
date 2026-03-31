// 后台订单页：查看支付状态和履约状态，后续会继续补异常订单和筛选能力。
export function OrdersPage() {
  const orders = [
    { id: "order-1", title: "儿童绘本套装", paymentStatus: "已支付", fulfillmentStatus: "待交付" }
  ];

  return (
    <section>
      <h1>订单管理</h1>
      <ul>
        {orders.map((item) => (
          <li key={item.id}>
            {item.title} - {item.paymentStatus} - {item.fulfillmentStatus}
          </li>
        ))}
      </ul>
    </section>
  );
}
