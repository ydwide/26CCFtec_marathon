// 我的捐赠页：集中查看每一次捐赠的当前状态，承接 App 端的长期追踪价值。
export function DonationsScreen() {
  const donations = [
    { id: "case-1", title: "儿童绘本", status: "已上架" },
    { id: "case-2", title: "保温杯", status: "待审核" }
  ];

  return (
    <section>
      <h1>我的捐赠</h1>
      <ul>
        {donations.map((item) => (
          <li key={item.id}>
            {item.title} - {item.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
