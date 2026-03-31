const API_BASE_URL = "http://localhost:3000";

export async function createDonationCase(payload: {
  title: string;
  conditionLabel: string;
  description: string;
}) {
  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("创建捐赠单失败");
  }

  return response.json();
}
