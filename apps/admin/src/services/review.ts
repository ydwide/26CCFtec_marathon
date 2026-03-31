// 后台审核服务：当前直接调用后端接口，读取审核草稿并提交确认上架。
const API_BASE_URL = "http://localhost:3000";

export async function getReviewDraft(donationCaseId: string) {
  const response = await fetch(`${API_BASE_URL}/reviews/${donationCaseId}`);

  if (!response.ok) {
    throw new Error("加载审核草稿失败");
  }

  return response.json();
}

export async function approveDonationCase(
  donationCaseId: string,
  payload: {
    title: string;
    description: string;
    category: string;
    conditionLabel: string;
    priceInCents: number;
  }
) {
  const response = await fetch(`${API_BASE_URL}/reviews/${donationCaseId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("确认上架失败");
  }

  return response.json();
}
