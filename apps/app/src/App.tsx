import { useState } from "react";
import { MessagesScreen } from "./screens/messages";
import { DonationsScreen } from "./screens/donations";
import { ArchiveScreen } from "./screens/archive";

type TabKey = "messages" | "donations" | "archive";

const tabs: { key: TabKey; label: string }[] = [
  { key: "messages", label: "消息中心" },
  { key: "donations", label: "我的捐赠" },
  { key: "archive", label: "公益档案" }
];

// App 预览壳：把当前已完成的消息、捐赠、公益档案页面串成一个本地可切换入口。
export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("messages");

  return (
    <div className="phone-shell">
      <header className="app-header">
        <h1>公益 App</h1>
      </header>

      <main className="app-content">
        {activeTab === "messages" ? <MessagesScreen /> : null}
        {activeTab === "donations" ? <DonationsScreen /> : null}
        {activeTab === "archive" ? <ArchiveScreen /> : null}
      </main>

      <footer className="tabbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? "tab-item active" : "tab-item"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
