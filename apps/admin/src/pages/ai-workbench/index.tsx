export function AiWorkbenchPage() {
  const suggestion = {
    title: "儿童绘本套装",
    category: "图书文具",
    description: "AI 已结合图片、标题和历史样本生成标准化上架草稿，可直接转审核页继续确认。",
    priceInCents: 2900
  };

  return (
    <section className="admin-surface">
      <div className="admin-surface__header">
        <h2>AI整理台</h2>
        <span className="admin-badge">待运营确认</span>
      </div>
      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>建议标题</span>
          <strong>{suggestion.title}</strong>
        </article>
        <article className="admin-stat-card">
          <span>建议类目</span>
          <strong>{suggestion.category}</strong>
        </article>
        <article className="admin-stat-card">
          <span>建议价格</span>
          <strong>¥{(suggestion.priceInCents / 100).toFixed(2)}</strong>
        </article>
      </div>
      <p className="admin-surface__text">{suggestion.description}</p>
    </section>
  );
}
