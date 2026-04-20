export function DataDashboardPage() {
  const metrics = [
    { label: "捐赠量", value: "128" },
    { label: "上架转化率", value: "62%" },
    { label: "成交量", value: "47" },
    { label: "公益流转记录", value: "39" }
  ];

  return (
    <section className="admin-surface">
      <div className="admin-surface__header">
        <h2>数据看板</h2>
        <span className="admin-badge">运营复盘</span>
      </div>
      <div className="admin-stat-grid">
        {metrics.map((item) => (
          <article key={item.label} className="admin-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
