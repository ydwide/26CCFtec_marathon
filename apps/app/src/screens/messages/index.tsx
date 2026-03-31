import { useEffect, useState } from "react";
import { listNotifications, markAsRead } from "../../services/notifications";

type NotificationItem = {
  id: string;
  title: string;
  summary: string;
  readAt: string | null;
};

// 消息中心：承接捐赠上架、订单变化、平台通知等关键消息触达。
export function MessagesScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    void listNotifications().then(setNotifications);
  }, []);

  async function handleMarkAsRead(id: string) {
    await markAsRead(id);
  }

  return (
    <section>
      <h1>消息中心</h1>
      <ul>
        {notifications.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            {!item.readAt ? (
              <button type="button" onClick={() => void handleMarkAsRead(item.id)}>
                标记已读
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
