// 工作台：给运营人员一个总览入口，先看到今日待处理事项和核心数量。
export function DashboardPage() {
  const cards = [
    { label: "待 AI 整理", value: 8 },
    { label: "待人工审核", value: 5 },
    { label: "待履约订单", value: 3 }
  ];

  return (
    <section>
      <h1>工作台</h1>
      <div>
        {cards.map((item) => (
          <article key={item.label}>
            <h2>{item.label}</h2>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
      <section>
        <h2>今日核心数据</h2>
        <p>捐赠提交 12 单，上架 6 件，成交 2 单。</p>
      </section>
    </section>
  );
}
