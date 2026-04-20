import { useState } from "react";
import { DashboardPage } from "./pages/dashboard";
import { AiWorkbenchPage } from "./pages/ai-workbench";
import { ReviewPage } from "./pages/review";
import { OrdersPage } from "./pages/orders";
import { DataDashboardPage } from "./pages/data-dashboard";

type TabKey = "dashboard" | "ai" | "review" | "orders" | "data";

const tabs: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "工作台" },
  { key: "ai", label: "AI整理台" },
  { key: "review", label: "审核上架" },
  { key: "orders", label: "订单管理" },
  { key: "data", label: "数据看板" }
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("review");

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>物命策展后台</h1>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {activeTab === "dashboard" ? <DashboardPage /> : null}
        {activeTab === "ai" ? <AiWorkbenchPage /> : null}
        {activeTab === "review" ? <ReviewPage donationCaseId="case-1" /> : null}
        {activeTab === "orders" ? <OrdersPage /> : null}
        {activeTab === "data" ? <DataDashboardPage /> : null}
      </main>
    </div>
  );
}
