const API_BASE_URL = "http://localhost:3000";

export type ReviewDraft = {
  donationId: string;
  statusLabel: string;
  rawItemName: string;
  rawDescription: string;
  rawImageUrl?: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedCategory: string;
  suggestedPriceInCents: number;
  conditionLabel: string;
  averagePriceInCents: number;
  priceQuery: string;
  pricingReason: string;
  provider: string;
  aiBrand: string;
  aiItemName: string;
  aiAttributes: Record<string, string>;
  sampleCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  priceSamples: Array<{
    id: string;
    sourcePlatform: string;
    sampleTitle: string;
    samplePrice: number;
  }>;
};

export async function getReviewDraft(donationCaseId: string): Promise<ReviewDraft> {
  const response = await fetch(`${API_BASE_URL}/reviews/${donationCaseId}`);

  if (!response.ok) {
    throw new Error("加载审核草稿失败");
  }

  return response.json();
}

export async function approveDonationCase(
  donationCaseId: string,
  payload:
    | {
        finalBrand?: string;
        finalItemName?: string;
        finalAttributes?: Record<string, string>;
        finalCategory?: string;
        finalConditionLabel?: string;
        finalTitle: string;
        finalDescription: string;
        finalPriceInCents: number;
      }
    | {
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
