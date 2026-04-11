export function OrdersPage() {
  const orders = [
    {
      id: "order-1",
      title: "儿童绘本套装",
      paymentStatus: "已支付",
      fulfillmentStatus: "待交付"
    }
  ];

  return (
    <section className="admin-surface">
      <div className="admin-surface__header">
        <h2>订单管理</h2>
        <span className="admin-badge">履约跟进</span>
      </div>
      <div className="admin-list">
        {orders.map((item) => (
          <article key={item.id} className="admin-list__item">
            <strong>{item.title}</strong>
            <span>{item.paymentStatus}</span>
            <em>{item.fulfillmentStatus}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
