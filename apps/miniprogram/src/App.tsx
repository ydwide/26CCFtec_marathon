import { useState } from "react";
import { DonatePage } from "./pages/donate";
import { DonateSuccessPage } from "./pages/donate-success";
import { ProgressPage } from "./pages/progress";
import { ProductDetailPage } from "./pages/detail";
import { OrdersPage } from "./pages/orders";

type TabKey = "donate" | "success" | "progress" | "detail" | "orders";

const tabs: { key: TabKey; label: string }[] = [
  { key: "donate", label: "我要捐赠" },
  { key: "success", label: "提交成功" },
  { key: "progress", label: "捐赠进度" },
  { key: "detail", label: "商品详情" },
  { key: "orders", label: "我的订单" }
];

// 小程序预览壳：把当前已完成的捐赠、进度、商品详情、订单页面串起来本地预览。
export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("donate");

  return (
    <div className="mini-shell">
      <header className="mini-header">
        <h1>公益小程序</h1>
      </header>

      <nav className="mini-nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? "mini-nav-item active" : "mini-nav-item"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="mini-content">
        {activeTab === "donate" ? <DonatePage /> : null}
        {activeTab === "success" ? <DonateSuccessPage /> : null}
        {activeTab === "progress" ? <ProgressPage currentStatus="待审核" /> : null}
        {activeTab === "detail" ? (
          <ProductDetailPage
            product={{
              id: "product-1",
              title: "儿童绘本套装",
              priceInCents: 2900,
              status: "销售中"
            }}
          />
        ) : null}
        {activeTab === "orders" ? <OrdersPage /> : null}
      </main>
    </div>
  );
}
