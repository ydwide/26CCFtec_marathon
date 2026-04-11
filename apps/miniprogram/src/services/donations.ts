const API_BASE_URL = "http://localhost:3000";

export async function createDonationCase(payload: {
  title: string;
  conditionLabel: string;
  description: string;
  imageUrls?: string[];
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

  const created = await response.json();

  const aiDraftResponse = await fetch(`${API_BASE_URL}/donations/${created.id}/ai-draft`, {
    method: "POST"
  });

  if (!aiDraftResponse.ok) {
    throw new Error("生成 AI 草稿失败");
  }

  const aiDraft = await aiDraftResponse.json();

  return {
    ...created,
    aiDraft
  };
}
