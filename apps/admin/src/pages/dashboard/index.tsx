export function DashboardPage() {
  const cards = [
    { label: "待AI整理", value: 8 },
    { label: "待人工审核", value: 5 },
    { label: "待履约订单", value: 3 }
  ];

  return (
    <section className="admin-surface">
      <div className="admin-surface__header">
        <h2>工作台</h2>
        <span className="admin-badge">今日概览</span>
      </div>
      <div className="admin-stat-grid">
        {cards.map((item) => (
          <article key={item.label} className="admin-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
      <p className="admin-surface__text">今日新增捐赠 12 单，完成上架 6 件，已成交 2 单，后台链路整体稳定。</p>
    </section>
  );
}
