// 公益档案页：沉淀用户捐赠和购买带来的公益参与记录。
export function ArchiveScreen() {
  const summary = {
    donatedCount: 2,
    purchasedCount: 1,
    latestImpactText: "你的儿童绘本已完成公益流转"
  };

  return (
    <section>
      <h1>公益档案</h1>
      <p>累计捐赠：{summary.donatedCount}</p>
      <p>累计购买支持：{summary.purchasedCount}</p>
      <p>{summary.latestImpactText}</p>
    </section>
  );
}
