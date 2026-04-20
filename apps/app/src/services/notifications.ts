const API_BASE_URL = "http://localhost:3000";
const DEFAULT_USER_ID = "demo-user";

export async function listNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications?userId=${DEFAULT_USER_ID}`);

  if (!response.ok) {
    throw new Error("加载消息失败");
  }

  return response.json();
}

export async function markAsRead(id: string) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("标记已读失败");
  }

  return response.json();
}
