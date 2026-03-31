// 数据看板：汇总捐赠、上架、成交和公益流转数据，给答辩与运营复盘使用。
export function DataDashboardPage() {
  const metrics = [
    { label: "捐赠量", value: "128" },
    { label: "上架转化率", value: "62%" },
    { label: "成交量", value: "47" },
    { label: "公益流转记录", value: "39" }
  ];

  return (
    <section>
      <h1>数据看板</h1>
      <ul>
        {metrics.map((item) => (
          <li key={item.label}>
            {item.label}：{item.value}
          </li>
        ))}
      </ul>
    </section>
  );
}
